import React from 'react';
import { Container, Typography, Button, Card, CardContent, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const insuranceTypes = [
    {
      title: 'Bảo Hiểm Nhân Thọ',
      description: 'Bảo vệ tương lai tài chính của gia đình bạn',
      icon: <HealthAndSafetyIcon fontSize="large" color="primary" />
    },
    {
      title: 'Bảo Hiểm Ô Tô',
      description: 'Bảo hiểm toàn diện cho xe của bạn',
      icon: <DirectionsCarIcon fontSize="large" color="primary" />
    },
    {
      title: 'Bảo Hiểm Nhà Ở',
      description: 'Bảo vệ ngôi nhà và tài sản của bạn',
      icon: <HomeIcon fontSize="large" color="primary" />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>      <Box textAlign="center" mb={4}>
        <Typography variant="h2" component="h1" gutterBottom>
          Chào Mừng Đến Với Bảo Hiểm An Toàn
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Đối tác tin cậy cho các giải pháp bảo hiểm toàn diện
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => navigate('/quote')}
          sx={{ mt: 2 }}
        >
          Nhận Báo Giá Miễn Phí
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
