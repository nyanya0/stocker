import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Sleek, professional light mode (Tailwind-inspired)
          primary: {
            main: '#4F46E5', // Indigo-600
            light: '#818CF8', // Indigo-400
            dark: '#3730A3', // Indigo-800
          },
          secondary: {
            main: '#0F172A', // Slate-900
          },
          background: {
            default: '#F8FAFC', // Slate-50 - very soft off-white
            paper: '#FFFFFF', // Pure white cards
          },
          text: {
            primary: '#0F172A', // Slate-900
            secondary: '#64748B', // Slate-500
          },
          divider: '#E2E8F0', // Slate-200
        }
      : {
          // Keep dark mode roughly the same but refine it slightly
          primary: {
            main: '#6366F1', // Indigo-500
          },
          secondary: {
            main: '#94A3B8', // Slate-400
          },
          background: {
            default: '#0F172A', // Slate-900
            paper: '#1E293B', // Slate-800
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "sans-serif"',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16, // Softer, more modern corners
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: mode === 'light' 
            ? '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)' // Tailwind shadow-lg
            : '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
          border: mode === 'light' ? '1px solid #F1F5F9' : '1px solid #334155', // Subtle borders
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
            transition: 'transform 0.2s ease',
          }
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          color: mode === 'light' ? '#0F172A' : '#FFFFFF',
          boxShadow: 'none',
          borderBottom: mode === 'light' ? '1px solid #E2E8F0' : '1px solid #334155',
        },
      },
    },
  },
});

export default getDesignTokens;
