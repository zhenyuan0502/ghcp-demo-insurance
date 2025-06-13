import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
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
import { useLanguage } from '../i18n/LanguageContext';

// Helper to format number with thousand separators for display
function formatNumberWithThousandSeparators(value: number | string) {
  if (value === null || value === undefined || value === '') return '';
  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
}

// Helper to parse formatted string back to number
function parseNumberFromFormatted(value: string) {
  if (!value) return 0;
  return Number(value.replace(/,/g, ''));
}

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
  const { language, t } = useLanguage();
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
  // Function to convert occupation value to localized name
  const getOccupationName = (occupationValue: string) => {
    const occupationKey = occupationValue as keyof typeof t.occupations;
    return t.occupations[occupationKey] || occupationValue;
  };

  const onSubmit = async (data: QuoteFormData) => {
    // Validate required fields manually (in case react-hook-form validation is bypassed)
    // Check for missing required fields and show specific message
    if (!data.productType || data.productType === '') {
      showSnackbar(t.quote.validation.selectProduct, 'error');
      return;
    }
    const requiredFields = [
      data.purchaserGender,
      data.purchaserAge,
      data.purchaserOccupation,
      data.insuredGender,
      data.insuredAge,
      data.insuredOccupation,
      data.monthlyPremium,
      data.yearlyPremium,
      data.insuranceAmount
    ];
    const hasEmpty = requiredFields.some(
      v => v === undefined || v === null || v === '' || (typeof v === 'number' && isNaN(v))
    );
    if (hasEmpty) {
      showSnackbar(t.quote.validation.enterGender, 'error');
      return;
    }
    try {
      // Convert the form data to the backend format
      const genderText = data.purchaserGender === 'male' ? t.genders.male : t.genders.female;
      const customerText = t.table.defaultValues.customer;
      const ageText = t.quote.age;
      const occupationText = t.quote.occupation;
      const insuredPersonText = t.table.defaultValues.insuredPerson;
      
      const purchaserFullName = `${customerText} ${genderText} - ${ageText} ${data.purchaserAge} - ${occupationText} ${getOccupationName(data.purchaserOccupation)}`;
      const insuredFullName = data.sameAsInsured
        ? purchaserFullName
        : `${insuredPersonText} ${data.insuredGender === 'male' ? t.genders.male : t.genders.female} - ${ageText} ${data.insuredAge} - ${occupationText} ${getOccupationName(data.insuredOccupation)}`;

      const backendData = {
        purchaserName: purchaserFullName,
        insuredName: insuredFullName,
        email: 'customer@example.com',
        phone: '0123456789',
        insuranceType: data.productType,
        coverageAmount: data.insuranceAmount.toString(),
        age: Number(data.purchaserAge) // Ensure age is converted to number
      };
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/quote`, backendData);
      console.log('Quote submitted:', response.data);
      showSnackbar(t.quote.notifications.submitSuccess, 'success');
    } catch (error) {
      console.error('Error submitting quote:', error);
      showSnackbar(t.quote.notifications.submitError, 'error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {t.quote.title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Product Type Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {t.quote.productType}
              </Typography>
              <Controller
                name="productType"
                control={control}
                defaultValue=""
                rules={{ required: t.quote.validation.selectProduct }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t.form.select}
                    error={!!errors.productType}
                    helperText={errors.productType?.message}
                  >
                    <MenuItem value="">{t.form.select}</MenuItem>
                    <MenuItem value="life">{t.insuranceTypes.life}</MenuItem>
                    <MenuItem value="health">{t.insuranceTypes.health}</MenuItem>
                    <MenuItem value="accident">{t.form.accidentInsurance}</MenuItem>
                    <MenuItem value="travel">{t.insuranceTypes.travel}</MenuItem>
                  </TextField>
                )}
              />
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
                  {t.quote.purchaserInfo}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 150px' }}>
                  <Controller
                    name="purchaserGender"
                    control={control}
                    defaultValue=""
                    rules={{ required: t.quote.validation.enterGender }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label={t.quote.gender}
                        error={!!errors.purchaserGender}
                        helperText={errors.purchaserGender?.message}
                      >
                        <MenuItem value="">{t.form.select}</MenuItem>
                        <MenuItem value="male">{t.genders.male}</MenuItem>
                        <MenuItem value="female">{t.genders.female}</MenuItem>
                      </TextField>
                    )}
                  />
                </Box>
                <Box sx={{ flex: '1 1 150px' }}>
                  <Controller
                    name="purchaserAge"
                    control={control}
                    defaultValue="" rules={{
                      required: t.quote.validation.enterAge,
                      validate: value => {
                        const num = Number(value);
                        if (isNaN(num) || num < 18) {
                          return t.form.ageValidation;
                        }
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t.quote.age}
                        type="number"
                        placeholder={t.form.enter}
                        error={!!errors.purchaserAge}
                        helperText={errors.purchaserAge?.message}
                        InputProps={{
                          inputProps: { inputMode: 'numeric', pattern: '[0-9]*' },
                        }}
                        sx={{
                          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                          },
                          '& input[type=number]': {
                            MozAppearance: 'textfield',
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <Controller
                    name="purchaserOccupation"
                    control={control}
                    defaultValue=""
                    rules={{ required: t.quote.validation.enterOccupation }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label={t.quote.occupation}
                        error={!!errors.purchaserOccupation}
                        helperText={errors.purchaserOccupation?.message}
                      >
                        <MenuItem value="">{t.form.select}</MenuItem>
                        <MenuItem value="office">{t.occupations.office}</MenuItem>
                        <MenuItem value="teacher">{t.occupations.teacher}</MenuItem>
                        <MenuItem value="doctor">{t.occupations.doctor}</MenuItem>
                        <MenuItem value="engineer">{t.occupations.engineer}</MenuItem>
                        <MenuItem value="business">{t.occupations.business}</MenuItem>
                        <MenuItem value="other">{t.occupations.other}</MenuItem>
                      </TextField>
                    )}
                  />
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
                label={t.quote.sameAsInsured}
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
                  {t.quote.insuredInfo}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 150px' }}>
                  <Controller
                    name="insuredGender"
                    control={control}
                    defaultValue=""
                    rules={!sameAsInsured ? { required: t.quote.validation.enterGender } : {}}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label={t.quote.gender}
                        error={!sameAsInsured && !!errors.insuredGender}
                        helperText={!sameAsInsured ? errors.insuredGender?.message : ''}
                        disabled={sameAsInsured}
                      >
                        <MenuItem value="">{t.form.select}</MenuItem>
                        <MenuItem value="male">{t.genders.male}</MenuItem>
                        <MenuItem value="female">{t.genders.female}</MenuItem>
                      </TextField>
                    )}
                  />
                </Box>

                <Box sx={{ flex: '1 1 150px' }}>                  <Controller
                  name="insuredAge"
                  control={control}
                  defaultValue="" rules={!sameAsInsured ? {
                    required: t.quote.validation.enterAge,
                    validate: value => {
                      const num = Number(value);
                      if (isNaN(num) || num < 0) {
                        return t.form.invalidAge;
                      }
                      return true;
                    }
                  } : {}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.quote.age}
                      type="number"
                      placeholder={language === 'vi' ? 'Nhập' : 'Enter'}
                      disabled={sameAsInsured} error={!sameAsInsured && !!errors.insuredAge}
                      helperText={!sameAsInsured ? errors.insuredAge?.message : ''}
                      InputProps={{
                        inputProps: { inputMode: 'numeric', pattern: '[0-9]*' },
                      }}
                      sx={{
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                        },
                      }}
                    />
                  )}
                />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <Controller
                    name="insuredOccupation"
                    control={control}
                    defaultValue=""
                    rules={!sameAsInsured ? { required: t.quote.validation.enterOccupation } : {}}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label={t.quote.occupation}
                        error={!sameAsInsured && !!errors.insuredOccupation}
                        helperText={!sameAsInsured ? errors.insuredOccupation?.message : ''}
                        disabled={sameAsInsured}
                      >
                        <MenuItem value="">{t.form.select}</MenuItem>
                        <MenuItem value="office">{t.occupations.office}</MenuItem>
                        <MenuItem value="teacher">{t.occupations.teacher}</MenuItem>
                        <MenuItem value="doctor">{t.occupations.doctor}</MenuItem>
                        <MenuItem value="engineer">{t.occupations.engineer}</MenuItem>
                        <MenuItem value="business">{t.occupations.business}</MenuItem>
                        <MenuItem value="other">{t.occupations.other}</MenuItem>
                      </TextField>
                    )}
                  />
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
                  {t.quote.paymentYears}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <Controller
                    name="monthlyPremium"
                    control={control}
                    defaultValue={0}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <TextField
                        {...rest}
                        value={formatNumberWithThousandSeparators(value)}
                        onChange={e => {
                          const raw = parseNumberFromFormatted(e.target.value);
                          onChange(raw);
                        }}
                        fullWidth
                        label={t.quote.monthlyPremium}
                        InputProps={{
                          endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>,
                          inputProps: { inputMode: 'numeric', pattern: '[0-9,]*' },
                        }}
                        placeholder="00.000"
                        sx={{
                          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                          },
                          '& input[type=number]': {
                            MozAppearance: 'textfield',
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <Controller
                    name="yearlyPremium"
                    control={control}
                    defaultValue={0}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <TextField
                        {...rest}
                        value={formatNumberWithThousandSeparators(value)}
                        onChange={e => {
                          const raw = parseNumberFromFormatted(e.target.value);
                          onChange(raw);
                        }}
                        fullWidth
                        label={t.quote.yearlyPremium}
                        InputProps={{
                          endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>,
                          inputProps: { inputMode: 'numeric', pattern: '[0-9,]*' },
                        }}
                        placeholder="00.000"
                        sx={{
                          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                          },
                          '& input[type=number]': {
                            MozAppearance: 'textfield',
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <Controller
                    name="insuranceAmount"
                    control={control}
                    defaultValue={0}
                    rules={{ required: t.quote.validation.enterAmount }}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <TextField
                        {...rest}
                        value={formatNumberWithThousandSeparators(value)}
                        onChange={e => {
                          const raw = parseNumberFromFormatted(e.target.value);
                          onChange(raw);
                        }}
                        fullWidth
                        label={t.quote.insuranceAmount}
                        InputProps={{
                          endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>,
                          inputProps: { inputMode: 'numeric', pattern: '[0-9,]*' },
                        }}
                        placeholder="00.000"
                        error={!!errors.insuranceAmount}
                        helperText={errors.insuranceAmount?.message}
                        sx={{
                          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                          },
                          '& input[type=number]': {
                            MozAppearance: 'textfield',
                          },
                        }}
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
                {t.quote.submitButton}
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
