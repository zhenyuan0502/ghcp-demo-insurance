import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import QuoteForm from './pages/QuoteForm';
import Dashboard from './pages/Dashboard';
import './App.css';

// Theme Context
interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // Light theme colors
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#dc004e',
        },
        background: {
          default: '#ffffff',
          paper: '#f5f5f5',
        },
      }
      : {
        // Dark theme colors
        primary: {
          main: '#90caf9',
        },
        secondary: {
          main: '#f48fb1',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      }),
  },
});

function App() {
  // Get initial theme from localStorage or default to 'light'
  const getInitialTheme = (): PaletteMode => {
    const savedTheme = localStorage.getItem('theme-mode');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  };

  const [mode, setMode] = useState<PaletteMode>(getInitialTheme);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const themeContextValue = useMemo(() => ({
    mode,
    toggleTheme,
  }), [mode]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quote" element={<QuoteForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
