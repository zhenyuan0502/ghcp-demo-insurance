import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <SecurityIcon sx={{ mr: 2 }} />        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bảo Hiểm An Toàn
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Trang Chủ
          </Button>
          <Button color="inherit" component={Link} to="/quote">
            Báo Giá
          </Button>
          <Button color="inherit" component={Link} to="/dashboard">
            Bảng Điều Khiển
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
