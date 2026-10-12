import React, { useContext, useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Box, CircularProgress, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, watchlistRes] = await Promise.all([
        api.get('/portfolio/summary'),
        api.get('/users/watchlist')
      ]);
      setSummary(summaryRes.data);
      setWatchlist(watchlistRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRemoveWatchlist = async (stockId) => {
    try {
      await api.post(`/users/watchlist/${stockId}`);
      // Refresh watchlist
      const { data } = await api.get('/users/watchlist');
      setWatchlist(data);
    } catch (error) {
      console.error('Error updating watchlist', error);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box className="py-4">
      <Typography variant="h4" className="font-bold text-slate-800 dark:text-white mb-2">
        Welcome back, {user?.name}
      </Typography>
      <Typography variant="body1" className="text-slate-500 dark:text-slate-400 mb-8">
        Here is a summary of your trading portfolio and current investments.
      </Typography>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <Typography className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Wallet Balance
            </Typography>
            <Typography variant="h4" className="font-bold text-indigo-600 dark:text-indigo-400">
              ${summary?.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </Typography>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <Typography className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Total Investment
            </Typography>
            <Typography variant="h4" className="font-bold">
              ${summary?.totalInvestment?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </Typography>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <Typography className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Current Value
            </Typography>
            <Typography variant="h4" className="font-bold">
              ${summary?.currentValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </Typography>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <Typography className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Total Profit / Loss
            </Typography>
            <Typography variant="h4" className={`font-bold ${summary?.totalProfitLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {summary?.totalProfitLoss >= 0 ? '+' : ''}
              ${summary?.totalProfitLoss?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Box className="mt-12">
        <Typography variant="h5" className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          Your Watchlist
        </Typography>
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <List className="p-0">
            {watchlist.map((stock, index) => (
              <ListItem 
                key={stock._id} 
                divider={index !== watchlist.length - 1}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors py-4 px-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold tracking-wider">
                      {stock.symbol}
                    </span>
                    <Typography className="text-slate-500 dark:text-slate-400 font-medium">
                      {stock.companyName}
                    </Typography>
                  </div>
                  <Typography variant="h6" className="text-slate-800 dark:text-white font-bold mt-1">
                    ${stock.currentPrice?.toFixed(2)}
                  </Typography>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => navigate(`/market/${stock._id}`)}
                    className="flex-1 sm:flex-none hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border-slate-200 dark:border-slate-700"
                  >
                    View Chart
                  </Button>
                  <IconButton color="error" onClick={() => handleRemoveWatchlist(stock._id)} className="hover:bg-red-50 dark:hover:bg-red-900/30">
                    <DeleteIcon />
                  </IconButton>
                </div>
              </ListItem>
            ))}
            {watchlist.length === 0 && (
              <ListItem className="py-12 text-center justify-center">
                <ListItemText 
                  primary={
                    <Typography className="text-slate-500 text-lg">
                      You haven't added any stocks to your watchlist yet. Go to the Market to star some!
                    </Typography>
                  } 
                />
              </ListItem>
            )}
          </List>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
