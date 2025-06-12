import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../App';

const Navbar: React.FC = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <AppBar position="static">      <Toolbar>
      <SecurityIcon sx={{ mr: 2 }} />
      <Typography variant="h6" component="div" sx={{ mr: 2 }}>
        Bảo Hiểm An Toàn
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
        <Button color="inherit" component={Link} to="/">
          Trang Chủ
        </Button>
        <Button color="inherit" component={Link} to="/quote">
          Báo Giá
        </Button>
        <Button color="inherit" component={Link} to="/dashboard">
          Bảng Điều Khiển
        </Button>
        <IconButton
          color="inherit"
          onClick={toggleTheme}
          sx={{ ml: 1 }}
          title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
    </Toolbar>
    </AppBar>
  );
};

export default Navbar;
