import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Card, CardContent, Grid, Snackbar, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../services/api';

const StockDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [stockRes, chartRes] = await Promise.all([
          api.get(`/stocks/${id}`),
          api.get(`/stocks/${id}/chart`)
        ]);

        setStock(stockRes.data);

        // Format chart data for Recharts
        const formattedData = chartRes.data.map((item) => ({
          date: new Date(item.date).toLocaleDateString(),
          price: item.close
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching stock details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
  }, [id]);

  const handleBuy = async () => {
    setActionLoading(true);
    try {
      await api.post('/trade/buy', { stockId: id, quantity: 1 });
      showToast(`Successfully purchased 1 share of ${stock.symbol}`, 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Transaction failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  if (!stock) {
    return <Typography variant="h5" sx={{ mt: 4 }}>Stock not found.</Typography>;
  }

  return (
    <Box className="py-4">
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/market')} 
        className="mb-6 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
      >
        Back to Market
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column (Takes up 2/3 of space on large screens) */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-slate-800 shadow-sm h-full">
            <CardContent className="p-6">
              <Typography variant="h5" className="font-bold text-slate-800 dark:text-white mb-6">
                {stock.companyName} ({stock.symbol}) - 30 Day History
              </Typography>
              <Box className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:opacity-20" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b' }} />
                    <YAxis domain={['auto', 'auto']} tickFormatter={(value) => `$${value.toFixed(2)}`} stroke="#64748b" tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Price']} 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Info Column (Takes up 1/3 of space on large screens) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="bg-white dark:bg-slate-800 shadow-sm border-t-4 border-indigo-500">
            <CardContent className="p-6">
              <Typography className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Current Price</Typography>
              <Typography variant="h3" className="font-bold text-slate-800 dark:text-white mb-6">
                ${stock.currentPrice?.toFixed(2)}
              </Typography>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <Typography className="text-slate-600 dark:text-slate-400">Sector</Typography>
                  <Typography className="font-semibold text-slate-800 dark:text-slate-200">{stock.sector}</Typography>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <Typography className="text-slate-600 dark:text-slate-400">Market Cap</Typography>
                  <Typography className="font-semibold text-slate-800 dark:text-slate-200">${(stock.marketCap / 1e9).toFixed(2)}B</Typography>
                </div>
                <div className="flex justify-between pb-2">
                  <Typography className="text-slate-600 dark:text-slate-400">Volume</Typography>
                  <Typography className="font-semibold text-slate-800 dark:text-slate-200">{(stock.volume / 1e6).toFixed(2)}M</Typography>
                </div>
              </div>

              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                onClick={handleBuy}
                disabled={actionLoading}
                className="py-3 font-bold text-lg shadow-md hover:shadow-lg transition-shadow bg-indigo-600 hover:bg-indigo-700"
              >
                {actionLoading ? 'Processing...' : 'Buy 1 Share'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} className="w-full">
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StockDetails;
