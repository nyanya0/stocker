import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Paper className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="text-center mb-8">
            <Typography variant="h3" className="font-bold text-slate-800 dark:text-white tracking-tight">
              Welcome Back
            </Typography>
            <Typography className="text-slate-500 dark:text-slate-400 mt-2">
              Sign in to your Stocker account
            </Typography>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center mb-6 font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-50 dark:bg-slate-900/50 rounded-lg"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-50 dark:bg-slate-900/50 rounded-lg"
            />
            
            <Button 
              fullWidth 
              variant="contained" 
              type="submit" 
              className="py-3 mt-4 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all rounded-xl"
            >
              Sign In
            </Button>
            
            <div className="text-center mt-6">
              <Typography className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <span 
                  className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate('/register')}
                >
                  Create one now
                </span>
              </Typography>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default Login;
