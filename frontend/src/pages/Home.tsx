import { Container, Typography, Button, Card, CardContent, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import { useLanguage } from '../i18n/LanguageContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const insuranceTypes = [
    {
      title: t.home.lifeInsurance.title,
      description: t.home.lifeInsurance.description,
      icon: <HealthAndSafetyIcon fontSize="large" color="primary" />
    },
    {
      title: t.home.autoInsurance.title,
      description: t.home.autoInsurance.description,
      icon: <DirectionsCarIcon fontSize="large" color="primary" />
    },
    {
      title: t.home.homeInsurance.title,
      description: t.home.homeInsurance.description,
      icon: <HomeIcon fontSize="large" color="primary" />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>      <Box textAlign="center" mb={4}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t.home.title}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {t.home.subtitle}
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => navigate('/quote')}
          sx={{ mt: 2 }}
        >
          {t.home.getQuoteButton}
        </Button>
      </Box><Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {insuranceTypes.map((type, index) => (
          <Box key={index} sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box mb={2}>
                  {type.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {type.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {type.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
