import React from 'react';
import { Typography, Box, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BoltIcon from '@mui/icons-material/Bolt';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box className="pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl mb-16">
        {/* Abstract Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900 opacity-90 z-0"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob z-0"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 z-0"></div>

        <div className="relative z-10 px-6 py-20 sm:px-12 sm:py-32 lg:px-20 flex flex-col items-center text-center">
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-indigo-200 font-semibold text-sm mb-8 border border-white/20 shadow-sm flex items-center gap-2">
            <TrendingUpIcon fontSize="small" /> The Ultimate Simulated Trading Experience
          </div>
          
          <Typography 
            variant="h1" 
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
          >
            Master the Market with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Stocker</span>
          </Typography>
          
          <Typography 
            variant="h5" 
            className="text-slate-300 font-medium max-w-2xl mb-12 leading-relaxed"
          >
            Practice trading stocks with real-time market data, build your portfolio, and test your strategies completely risk-free.
          </Typography>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/register')} 
              className="py-4 px-10 rounded-xl font-bold text-lg bg-indigo-500 hover:bg-indigo-600 shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Start Trading Now
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/login')}
              className="py-4 px-10 rounded-xl font-bold text-lg border-2 border-white/20 text-white hover:bg-white/10 transition-all"
            >
              Login to Account
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="text-center mb-12">
        <Typography variant="h3" className="font-bold text-slate-800 dark:text-white mb-4">
          Why Choose Stocker?
        </Typography>
        <Typography variant="h6" className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Everything you need to become a successful trader, packed into a single, beautiful platform.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-white dark:bg-slate-800 border-none shadow-xl hover:shadow-2xl transition-shadow rounded-2xl">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <ShowChartIcon fontSize="large" />
            </div>
            <Typography variant="h5" className="font-bold text-slate-800 dark:text-white mb-3">
              Real-Time Data
            </Typography>
            <Typography className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Experience the rush of the live market. Our platform pulls real-to-the-second pricing data from Wall Street.
            </Typography>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-none shadow-xl hover:shadow-2xl transition-shadow rounded-2xl">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <AccountBalanceWalletIcon fontSize="large" />
            </div>
            <Typography variant="h5" className="font-bold text-slate-800 dark:text-white mb-3">
              $100,000 Virtual Cash
            </Typography>
            <Typography className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Start your journey with a massive virtual bankroll. Test your boldest investment strategies with absolutely zero financial risk.
            </Typography>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-none shadow-xl hover:shadow-2xl transition-shadow rounded-2xl">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <BoltIcon fontSize="large" />
            </div>
            <Typography variant="h5" className="font-bold text-slate-800 dark:text-white mb-3">
              Lightning Fast
            </Typography>
            <Typography className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Built on modern architecture, ensuring your trades execute instantly. Never miss an opportunity when the market moves.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Box>
  );
};

export default Home;
