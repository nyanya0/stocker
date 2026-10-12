import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const MainLayout = ({ children, toggleTheme, mode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <AppBar position="sticky" className="z-50">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="flex justify-between items-center py-2">
            <Box 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-1.5 rounded-lg shadow-md flex items-center justify-center">
                <TrendingUpIcon fontSize="small" />
              </div>
              <Typography 
                variant="h6" 
                component="div" 
                className="font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 hidden sm:block" 
              >
                Stocker
              </Typography>
            </Box>
            
            <Box className="flex items-center gap-2">
              {user ? (
                <>
                  <Button color="inherit" onClick={() => navigate('/dashboard')} className="font-semibold">Dashboard</Button>
                  <Button color="inherit" onClick={() => navigate('/market')} className="font-semibold">Market</Button>
                  <Button color="inherit" onClick={() => navigate('/portfolio')} className="font-semibold">Portfolio</Button>

                  {user.role === 'ADMIN' && (
                    <Button color="inherit" onClick={() => navigate('/admin')} className="ml-2 border border-current opacity-80 hover:opacity-100 rounded-lg">Admin Panel</Button>
                  )}
                  <Button color="inherit" onClick={handleLogout} className="ml-4 font-bold bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2">Logout</Button>
                </>
              ) : (
                <>

                  <Button color="inherit" onClick={() => navigate('/login')} className="font-semibold">Login</Button>
                  <Button color="inherit" onClick={() => navigate('/register')} className="font-bold bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2">Register</Button>
                </>
              )}
              
              <IconButton className="ml-4" onClick={toggleTheme} color="inherit" aria-label="Toggle light/dark theme">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" className="flex-grow p-6 sm:p-8 md:p-12">
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
