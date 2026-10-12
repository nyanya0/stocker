import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, TextField, CircularProgress, Snackbar, Alert, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Market = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const showToast = (msg, severity = 'error') => {
    setToastMessage(msg);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToastOpen(false);
  };

  const fetchInitialData = async (search = '') => {
    setLoading(true);
    try {
      const [stocksRes, watchlistRes] = await Promise.all([
        api.get(`/stocks?keyword=${search}`),
        api.get('/users/watchlist')
      ]);
      setStocks(stocksRes.data);
      setWatchlist(watchlistRes.data.map(stock => stock._id));
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  // 2. Live price updates (simple polling every 3 seconds - works on any free host)
  useEffect(() => {
    let cancelled = false;

    const fetchLivePrices = async () => {
      try {
        const { data: updatedPrices } = await api.get('/stocks/live');
        if (cancelled) return;
        setStocks((currentStocks) =>
          currentStocks.map((stock) => {
            const update = updatedPrices.find((p) => p._id === stock._id);
            return update ? { ...stock, currentPrice: update.currentPrice } : stock;
          })
        );
      } catch (error) {
        // ignore - we'll try again on the next tick
      }
    };

    const timer = setInterval(fetchLivePrices, 3000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInitialData(keyword);
  };

  const handleToggleWatchlist = async (stockId) => {
    try {
      const { data } = await api.post(`/users/watchlist/${stockId}`);
      setWatchlist(data.map(s => s._id));
      showToast('Watchlist updated!', 'success');
    } catch (error) {
      showToast('Error updating watchlist', 'error');
    }
  };

  const handleBuy = async (stockId) => {
    setActionLoading(true);
    try {
      await api.post('/trade/buy', { stockId, quantity: 1 });
      showToast('Stock purchased successfully!', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Transaction failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box className="py-4">
      <Typography variant="h4" className="font-bold text-slate-800 dark:text-white mb-6">
        Stock Market
      </Typography>

      <form onSubmit={handleSearch} className="flex mb-12 gap-3 max-w-2xl mx-auto">
        <TextField
          label="Search Stocks (e.g., AAPL)"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-grow bg-white dark:bg-slate-800 rounded-lg shadow-sm"
          size="small"
        />
        <Button variant="contained" type="submit" className="shadow-none px-6">
          Search
        </Button>
      </form>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stocks.map((stock) => (
            <Card key={stock._id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold tracking-wider mb-2">
                      {stock.symbol}
                    </span>
                    <Typography className="text-slate-500 dark:text-slate-400 font-medium line-clamp-1" title={stock.companyName}>
                      {stock.companyName}
                    </Typography>
                  </div>
                  <IconButton 
                    onClick={() => handleToggleWatchlist(stock._id)} 
                    className={`-mt-2 -mr-2 ${watchlist.includes(stock._id) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'}`}
                  >
                    {watchlist.includes(stock._id) ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                </div>
                
                <div className="mt-4 mb-6">
                  <Typography variant="h4" className="font-bold text-slate-800 dark:text-white">
                    ${stock.currentPrice?.toFixed(2)}
                  </Typography>
                  <Typography className="text-xs text-slate-400 uppercase tracking-wide mt-1">
                    Sector: {stock.sector}
                  </Typography>
                </div>
              </CardContent>
              
              <div className="px-6 pb-6 mt-auto">
                <div className="flex gap-3">
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    className="flex-1 py-2 font-semibold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    onClick={() => navigate(`/market/${stock._id}`)}
                  >
                    Chart
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    className="flex-1 py-2 font-semibold shadow-md hover:shadow-lg"
                    onClick={() => handleBuy(stock._id)}
                    disabled={actionLoading}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {stocks.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <Typography variant="h6" className="text-slate-400">
                No stocks found matching your search.
              </Typography>
            </div>
          )}
        </div>
      )}

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Market;
