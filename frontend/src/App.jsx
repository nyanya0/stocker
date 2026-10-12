import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getDesignTokens from './theme';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Dashboard from './pages/user/Dashboard';
import Market from './pages/user/Market';
import Portfolio from './pages/user/Portfolio';
import StockDetails from './pages/user/StockDetails';
import Chatbot from './components/Chatbot';

import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [mode, setMode] = useState('light'); // Default to light mode for better initial impression
  
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <MainLayout toggleTheme={colorMode.toggleColorMode} mode={mode}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User Routes (Should be protected) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/market" element={<Market />} />
              <Route path="/market/:id" element={<StockDetails />} />
              <Route path="/portfolio" element={<Portfolio />} />

              
              {/* Admin Route */}
              <Route path="/admin" element={<AdminDashboard />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Chatbot />
          </MainLayout>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
