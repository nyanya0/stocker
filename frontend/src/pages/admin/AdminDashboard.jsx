import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button, Tabs, Tab, Grid, Card, CardContent, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
    if (user && user.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchAllData();
    // eslint-disable-next-line
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, txRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/transactions'),
        api.get('/admin/analytics')
      ]);
      setUsers(usersRes.data);
      setTransactions(txRes.data);
      setAnalytics(statsRes.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Error fetching admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerDelete = (id) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (!userToDelete) return;
    try {
      await api.delete(`/admin/users/${userToDelete}`);
      showToast('User deleted successfully', 'success');
      fetchAllData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Control Panel
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Registered Users</Typography>
              <Typography variant="h4">{analytics?.totalUsers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Global Transactions</Typography>
              <Typography variant="h4">{analytics?.totalTrades || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
          <Tab label="Manage Users" />
          <Tab label="All Transactions" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Wallet Balance</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Typography color={u.role === 'ADMIN' ? 'error.main' : 'textPrimary'}>
                      {u.role}
                    </Typography>
                  </TableCell>
                  <TableCell>${u.walletBalance?.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Button 
                      color="error" 
                      variant="outlined" 
                      size="small"
                      onClick={() => triggerDelete(u._id)}
                      disabled={u.role === 'ADMIN'}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabIndex === 1 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{tx.userId?.name || 'Deleted User'}</TableCell>
                  <TableCell>
                    <Typography color={tx.type === 'BUY' ? 'success.main' : 'error.main'} variant="body2" fontWeight="bold">
                      {tx.type}
                    </Typography>
                  </TableCell>
                  <TableCell>{tx.stockId?.symbol}</TableCell>
                  <TableCell align="right">{tx.quantity}</TableCell>
                  <TableCell align="right">${tx.price?.toFixed(2)}</TableCell>
                  <TableCell align="right">${tx.totalAmount?.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
