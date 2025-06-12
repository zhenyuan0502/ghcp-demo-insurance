import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface QuoteFormData {
  productType: string;
  purchaserGender: string;
  purchaserAge: number | string;
  purchaserOccupation: string;
  insuredGender: string;
  insuredAge: number | string;
  insuredOccupation: string;
  monthlyPremium: number;
  yearlyPremium: number;
  insuranceAmount: number;
  sameAsInsured: boolean;
}

const QuoteForm: React.FC = () => {
  const { control, handleSubmit, watch, setValue, clearErrors, formState: { errors } } = useForm<QuoteFormData>();
  const sameAsInsured = watch('sameAsInsured', false);

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Watch purchaser fields to sync with insured fields
  const purchaserGender = watch('purchaserGender');
  const purchaserAge = watch('purchaserAge');
  const purchaserOccupation = watch('purchaserOccupation');

  // Auto-sync insured fields when sameAsInsured is checked
  useEffect(() => {
    if (sameAsInsured) {
      setValue('insuredGender', purchaserGender || '');
      setValue('insuredAge', purchaserAge || '');
      setValue('insuredOccupation', purchaserOccupation || '');
      // Clear any validation errors for insured fields
      clearErrors(['insuredGender', 'insuredAge', 'insuredOccupation']);
    }
  }, [sameAsInsured, purchaserGender, purchaserAge, purchaserOccupation, setValue, clearErrors]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const onSubmit = async (data: QuoteFormData) => {
    try {      // Convert the Vietnamese form data to the backend format
      const purchaserFullName = `${data.purchaserGender === 'male' ? 'Anh' : 'Chị'} Khách hàng ${data.purchaserGender === 'male' ? 'Nam' : 'Nữ'}`;
      const insuredFullName = data.sameAsInsured
        ? purchaserFullName
        : `${data.insuredGender === 'male' ? 'Anh' : 'Chị'} Người được bảo hiểm ${data.insuredGender === 'male' ? 'Nam' : 'Nữ'}`;

      const backendData = {
        firstName: 'Khách hàng',
        lastName: data.purchaserGender === 'male' ? 'Nam' : 'Nữ',
        purchaserName: purchaserFullName,
        insuredName: insuredFullName,
        email: 'customer@example.com',
        phone: '0123456789',
        insuranceType: data.productType,
        coverageAmount: data.insuranceAmount.toString(),
        age: Number(data.purchaserAge) // Ensure age is converted to number
      };
      const response = await axios.post('http://localhost:5000/api/quote', backendData);
      console.log('Quote submitted:', response.data);
      showSnackbar('Báo giá đã được gửi thành công!', 'success');
    } catch (error) {
      console.error('Error submitting quote:', error);
      showSnackbar('Có lỗi xảy ra khi gửi báo giá. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Product Type Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Loại sản phẩm
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Chọn</InputLabel>
                <Controller
                  name="productType"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Vui lòng chọn loại sản phẩm' }}
                  render={({ field }) => (
                    <Select {...field} label="Chọn">
                      <MenuItem value="life">Bảo hiểm nhân thọ</MenuItem>
                      <MenuItem value="health">Bảo hiểm sức khỏe</MenuItem>
                      <MenuItem value="accident">Bảo hiểm tai nạn</MenuItem>
                      <MenuItem value="travel">Bảo hiểm du lịch</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Box>

            <Divider />

            {/* Insurance Purchaser Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  mr: 1
                }} />
                <Typography variant="h6">
                  Bên mua bảo hiểm
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 150px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Giới tính</InputLabel>
                    <Controller
                      name="purchaserGender"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Vui lòng chọn giới tính' }}
                      render={({ field }) => (
                        <Select {...field} label="Giới tính">
                          <MenuItem value="">Chọn</MenuItem>
                          <MenuItem value="male">Nam</MenuItem>
                          <MenuItem value="female">Nữ</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 150px' }}>
                  <Controller
                    name="purchaserAge"
                    control={control}
                    defaultValue="" rules={{
                      required: 'Vui lòng nhập tuổi',
                      validate: value => {
                        const num = Number(value);
                        if (isNaN(num) || num < 18) {
                          return 'Tuổi phải từ 18 trở lên';
                        }
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tuổi"
                        type="number"
                        placeholder="Nhập"
                        error={!!errors.purchaserAge}
                        helperText={errors.purchaserAge?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Loại nghề nghiệp</InputLabel>
                    <Controller
                      name="purchaserOccupation"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Vui lòng chọn nghề nghiệp' }}
                      render={({ field }) => (
                        <Select {...field} label="Loại nghề nghiệp">
                          <MenuItem value="">Chọn</MenuItem>
                          <MenuItem value="office">Văn phòng</MenuItem>
                          <MenuItem value="teacher">Giáo viên</MenuItem>
                          <MenuItem value="doctor">Bác sĩ</MenuItem>
                          <MenuItem value="engineer">Kỹ sư</MenuItem>
                          <MenuItem value="business">Kinh doanh</MenuItem>
                          <MenuItem value="other">Khác</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Controller
                    name="sameAsInsured"
                    control={control}
                    defaultValue={false}
                    render={({ field: { onChange, value, ...field } }) => (
                      <Checkbox
                        {...field}
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        sx={{ '& .MuiSvgIcon-root': { color: '#4caf50' } }}
                      />
                    )}
                  />
                }
                label="Thông tin Bên mua bảo hiểm & Bên được bao hiểm giống nhau:"
                sx={{ mt: 2 }}
              />
            </Box>

            <Divider />

            {/* Insured Person Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  mr: 1
                }} />
                <Typography variant="h6">
                  Bên được bảo hiểm
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 150px' }}>
                  <FormControl fullWidth disabled={sameAsInsured}>
                    <InputLabel>Giới tính</InputLabel>
                    <Controller
                      name="insuredGender"
                      control={control}
                      defaultValue=""
                      rules={!sameAsInsured ? { required: 'Vui lòng chọn giới tính' } : {}}
                      render={({ field }) => (
                        <Select {...field} label="Giới tính">
                          <MenuItem value="">Chọn</MenuItem>
                          <MenuItem value="male">Nam</MenuItem>
                          <MenuItem value="female">Nữ</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>

                <Box sx={{ flex: '1 1 150px' }}>                  <Controller
                  name="insuredAge"
                  control={control}
                  defaultValue="" rules={!sameAsInsured ? {
                    required: 'Vui lòng nhập tuổi',
                    validate: value => {
                      const num = Number(value);
                      if (isNaN(num) || num < 0) {
                        return 'Tuổi không hợp lệ';
                      }
                      return true;
                    }
                  } : {}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tuổi"
                      type="number"
                      placeholder="Nhập"
                      disabled={sameAsInsured} error={!sameAsInsured && !!errors.insuredAge}
                      helperText={!sameAsInsured ? errors.insuredAge?.message : ''}
                    />
                  )}
                />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <FormControl fullWidth disabled={sameAsInsured}>
                    <InputLabel>Loại nghề nghiệp</InputLabel>
                    <Controller
                      name="insuredOccupation"
                      control={control}
                      defaultValue=""
                      rules={!sameAsInsured ? { required: 'Vui lòng chọn nghề nghiệp' } : {}}
                      render={({ field }) => (
                        <Select {...field} label="Loại nghề nghiệp">
                          <MenuItem value="">Chọn</MenuItem>
                          <MenuItem value="office">Văn phòng</MenuItem>
                          <MenuItem value="teacher">Giáo viên</MenuItem>
                          <MenuItem value="doctor">Bác sĩ</MenuItem>
                          <MenuItem value="engineer">Kỹ sư</MenuItem>
                          <MenuItem value="business">Kinh doanh</MenuItem>
                          <MenuItem value="other">Khác</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Payment Years Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  mr: 1
                }} />
                <Typography variant="h6">
                  Số năm đóng
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <Controller
                    name="monthlyPremium"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Số phí dự kiến/ tháng"
                        type="number"
                        InputProps={{
                          endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                        }}
                        placeholder="00.000"
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <Controller
                    name="yearlyPremium"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Số phí chính xác/ tháng"
                        type="number"
                        InputProps={{
                          endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                        }}
                        placeholder="00.000"
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <Controller
                    name="insuranceAmount"
                    control={control}
                    defaultValue={0}
                    rules={{ required: 'Vui lòng nhập số tiền bảo hiểm' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Số tiền bảo hiểm"
                        type="number"
                        InputProps={{
                          endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                        }}
                        placeholder="00.000"
                        error={!!errors.insuranceAmount}
                        helperText={errors.insuranceAmount?.message}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#4caf50',
                  '&:hover': { backgroundColor: '#45a049' },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Go!!
              </Button>
            </Box>
          </Box>        </Box>
      </Paper>

      {/* Modern Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuoteForm;
