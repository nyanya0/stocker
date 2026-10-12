import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button, Snackbar, Alert, Card, CardContent } from '@mui/material';
import api from '../../services/api';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
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
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get('/portfolio');
      setPortfolio(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleSell = async (stockId) => {
    setActionLoading(true);
    try {
      await api.post('/trade/sell', { stockId, quantity: 1 });
      showToast('Stock sold successfully!', 'success');
      fetchPortfolio();
    } catch (error) {
      showToast(error.response?.data?.message || 'Transaction failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box className="py-4">
      <Typography variant="h4" className="font-bold text-slate-800 dark:text-white mb-6">
        Your Portfolio
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-800 shadow-sm border-l-4 border-indigo-500">
          <CardContent className="p-6">
            <Typography className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Investment</Typography>
            <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">${portfolio?.totalInvestment?.toFixed(2) || '0.00'}</Typography>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 shadow-sm border-l-4 border-indigo-500">
          <CardContent className="p-6">
            <Typography className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Current Value</Typography>
            <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">${portfolio?.currentValue?.toFixed(2) || '0.00'}</Typography>
          </CardContent>
        </Card>
        <Card className={`bg-white dark:bg-slate-800 shadow-sm border-l-4 ${portfolio?.totalProfitLoss >= 0 ? 'border-green-500' : 'border-red-500'}`}>
          <CardContent className="p-6">
            <Typography className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Profit / Loss</Typography>
            <Typography variant="h5" className={`font-bold ${portfolio?.totalProfitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {portfolio?.totalProfitLoss >= 0 ? '+' : ''}${portfolio?.totalProfitLoss?.toFixed(2) || '0.00'}
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <TableContainer>
          <Table>
            <TableHead className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow>
                <TableCell className="font-bold text-slate-500 dark:text-slate-400">Symbol</TableCell>
                <TableCell className="font-bold text-slate-500 dark:text-slate-400">Company</TableCell>
                <TableCell align="right" className="font-bold text-slate-500 dark:text-slate-400">Quantity</TableCell>
                <TableCell align="right" className="font-bold text-slate-500 dark:text-slate-400">Avg. Price</TableCell>
                <TableCell align="right" className="font-bold text-slate-500 dark:text-slate-400">Current Price</TableCell>
                <TableCell align="right" className="font-bold text-slate-500 dark:text-slate-400">Total Value</TableCell>
                <TableCell align="right" className="font-bold text-slate-500 dark:text-slate-400">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio?.holdings?.map((row) => (
                <TableRow key={row._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <TableCell component="th" scope="row">
                    <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold tracking-wider">
                      {row.stockId?.symbol}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 dark:text-slate-300">{row.stockId?.companyName}</TableCell>
                  <TableCell align="right" className="font-bold text-slate-800 dark:text-white">{row.quantity}</TableCell>
                  <TableCell align="right" className="text-slate-600 dark:text-slate-400">${row.averagePrice?.toFixed(2)}</TableCell>
                  <TableCell align="right" className="text-slate-600 dark:text-slate-400">${row.stockId?.currentPrice?.toFixed(2)}</TableCell>
                  <TableCell align="right" className="font-bold text-slate-800 dark:text-white">${(row.quantity * row.stockId?.currentPrice)?.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      onClick={() => handleSell(row.stockId?._id)}
                      disabled={actionLoading}
                      size="small"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Sell
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!portfolio?.holdings || portfolio.holdings.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-12 text-slate-500">
                    <Typography className="text-lg">You don't own any stocks yet. Head to the Market to buy some!</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Portfolio;
