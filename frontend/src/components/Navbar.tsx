import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import { useThemeContext } from '../App';
import { useLanguage } from '../i18n/LanguageContext';

const Navbar: React.FC = () => {
  const { mode, toggleTheme } = useThemeContext();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <AppBar position="static">      <Toolbar>
      <SecurityIcon sx={{ mr: 2 }} />
      <Typography variant="h6" component="div" sx={{ mr: 2 }}>
        {t.navbar.title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
        <Button color="inherit" component={Link} to="/">
          {t.navbar.home}
        </Button>
        <Button color="inherit" component={Link} to="/quote">
          {t.navbar.quote}
        </Button>
        <Button color="inherit" component={Link} to="/claim">
          {t.navbar.claim}
        </Button>
        <Button color="inherit" component={Link} to="/dashboard">
          {t.navbar.dashboard}
        </Button>
        <IconButton
          color="inherit"
          onClick={toggleLanguage}
          sx={{ ml: 1 }}
          title={language === 'vi' ? t.navbar.switchToEnglish : t.navbar.switchToVietnamese}
        >
          <LanguageIcon />
          <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
            {language.toUpperCase()}
          </Typography>
        </IconButton>
        <IconButton
          color="inherit"
          onClick={toggleTheme}
          sx={{ ml: 1 }}
          title={mode === 'dark' ? t.navbar.switchToLight : t.navbar.switchToDark}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
    </Toolbar>
    </AppBar>
  );
};

export default Navbar;
