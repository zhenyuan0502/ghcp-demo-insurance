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
import { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../i18n/LanguageContext';
import { validateEmail, validatePhone } from '../utils/helpers';

interface ClaimFormData {
  // Policyholder Information
  policyholderName: string;
  policyNumber: string;
  contactNumber: string;
  email: string;
  // Incident Details
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  claimType: string;
  // Claim Details
  estimatedCost: number | string;
  itemsAffected: string;
  policeReportFiled: boolean;
  policeReportNumber: string;
  // Banking Information
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  swiftCode: string;
  // Declaration
  informationConfirmed: boolean;
  signature: string;
}

const ClaimForm: React.FC = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<ClaimFormData>();
  const { t } = useLanguage();
  const policeReportFiled = watch('policeReportFiled', false);

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

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

  const onSubmit = async (data: ClaimFormData) => {
    // Validate required fields
    const requiredFields = [
      data.policyholderName,
      data.policyNumber,
      data.contactNumber,
      data.email,
      data.incidentDate,
      data.incidentTime,
      data.incidentLocation,
      data.incidentDescription,
      data.claimType,
      data.estimatedCost,
      data.itemsAffected,
      data.bankName,
      data.accountHolderName,
      data.accountNumber,
      data.signature
    ];

    const hasEmpty = requiredFields.some(
      v => v === undefined || v === null || v === '' || (typeof v === 'number' && isNaN(v))
    );

    if (hasEmpty) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    // Validate email format
    if (!validateEmail(data.email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    // Validate phone format
    if (!validatePhone(data.contactNumber)) {
      showSnackbar('Please enter a valid contact number', 'error');
      return;
    }

    // Validate police report number if police report was filed
    if (data.policeReportFiled && !data.policeReportNumber) {
      showSnackbar(t.claim.validation.policeReportNumberRequired, 'error');
      return;
    }

    // Validate confirmation checkbox
    if (!data.informationConfirmed) {
      showSnackbar(t.claim.validation.confirmationRequired, 'error');
      return;
    }

    try {
      const backendData = {
        policyholderName: data.policyholderName,
        policyNumber: data.policyNumber,
        contactNumber: data.contactNumber,
        email: data.email,
        incidentDate: data.incidentDate,
        incidentTime: data.incidentTime,
        incidentLocation: data.incidentLocation,
        incidentDescription: data.incidentDescription,
        claimType: data.claimType,
        estimatedCost: Number(data.estimatedCost),
        itemsAffected: data.itemsAffected,
        policeReportFiled: data.policeReportFiled,
        policeReportNumber: data.policeReportNumber || null,
        bankName: data.bankName,
        accountHolderName: data.accountHolderName,
        accountNumber: data.accountNumber,
        swiftCode: data.swiftCode || null,
        informationConfirmed: data.informationConfirmed,
        signature: data.signature
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/claim`, backendData);
      console.log('Claim submitted:', response.data);
      showSnackbar(t.claim.notifications.submitSuccess, 'success');
    } catch (error) {
      console.error('Error submitting claim:', error);
      showSnackbar(t.claim.notifications.submitError, 'error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {t.claim.title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Policyholder Information Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {t.claim.policyholderInfo}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Controller
                  name="policyholderName"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.fullNameRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.fullName}
                      error={!!errors.policyholderName}
                      helperText={errors.policyholderName?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="policyNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.policyNumberRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.policyNumber}
                      error={!!errors.policyNumber}
                      helperText={errors.policyNumber?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="contactNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.contactNumberRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.contactNumber}
                      error={!!errors.contactNumber}
                      helperText={errors.contactNumber?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.emailRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="email"
                      label={t.claim.email}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      required
                    />
                  )}
                />
              </Box>
            </Box>

            <Divider />

            {/* Incident Details Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {t.claim.incidentDetails}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Controller
                  name="incidentDate"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.incidentDateRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label={t.claim.incidentDate}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.incidentDate}
                      helperText={errors.incidentDate?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="incidentTime"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.incidentTimeRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="time"
                      label={t.claim.incidentTime}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.incidentTime}
                      helperText={errors.incidentTime?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="incidentLocation"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.incidentLocationRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.incidentLocation}
                      multiline
                      rows={2}
                      error={!!errors.incidentLocation}
                      helperText={errors.incidentLocation?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="incidentDescription"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.incidentDescriptionRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.incidentDescription}
                      multiline
                      rows={4}
                      error={!!errors.incidentDescription}
                      helperText={errors.incidentDescription?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="claimType"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.claimTypeRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label={t.claim.claimType}
                      error={!!errors.claimType}
                      helperText={errors.claimType?.message}
                      required
                    >
                      <MenuItem value="">{t.form.select}</MenuItem>
                      <MenuItem value="auto">{t.insuranceTypes.auto}</MenuItem>
                      <MenuItem value="home">{t.insuranceTypes.home}</MenuItem>
                      <MenuItem value="health">{t.insuranceTypes.health}</MenuItem>
                      <MenuItem value="life">{t.insuranceTypes.life}</MenuItem>
                      <MenuItem value="travel">{t.insuranceTypes.travel}</MenuItem>
                      <MenuItem value="other">{t.insuranceTypes.other}</MenuItem>
                    </TextField>
                  )}
                />
              </Box>
            </Box>

            <Divider />

            {/* Claim Details Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {t.claim.claimDetails}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Controller
                  name="estimatedCost"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.estimatedCostRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label={t.claim.estimatedCost}
                      error={!!errors.estimatedCost}
                      helperText={errors.estimatedCost?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="itemsAffected"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.itemsAffectedRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.itemsAffected}
                      multiline
                      rows={3}
                      error={!!errors.itemsAffected}
                      helperText={errors.itemsAffected?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="policeReportFiled"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label={t.claim.policeReportFiled}
                    />
                  )}
                />
                {policeReportFiled && (
                  <Controller
                    name="policeReportNumber"
                    control={control}
                    defaultValue=""
                    rules={{ required: policeReportFiled ? t.claim.validation.policeReportNumberRequired : false }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t.claim.policeReportNumber}
                        error={!!errors.policeReportNumber}
                        helperText={errors.policeReportNumber?.message}
                        required={policeReportFiled}
                      />
                    )}
                  />
                )}
              </Box>
            </Box>

            <Divider />

            {/* Supporting Documents Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {t.claim.supportingDocuments}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t.claim.supportingDocumentsNote}
              </Typography>
              <TextField
                fullWidth
                label={t.claim.witnessInfo}
                multiline
                rows={2}
                placeholder="Name: John Doe, Contact: +1234567890"
              />
            </Box>

            <Divider />

            {/* Banking Information Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {t.claim.bankingInfo}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Controller
                  name="bankName"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.bankNameRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.bankName}
                      error={!!errors.bankName}
                      helperText={errors.bankName?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="accountHolderName"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.accountHolderNameRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.accountHolderName}
                      error={!!errors.accountHolderName}
                      helperText={errors.accountHolderName?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="accountNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.accountNumberRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.accountNumber}
                      error={!!errors.accountNumber}
                      helperText={errors.accountNumber?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="swiftCode"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.swiftCode}
                    />
                  )}
                />
              </Box>
            </Box>

            <Divider />

            {/* Declaration Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {t.claim.declaration}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Controller
                  name="informationConfirmed"
                  control={control}
                  defaultValue={false}
                  rules={{ required: t.claim.validation.confirmationRequired }}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label={t.claim.confirmInformation}
                    />
                  )}
                />
                <Controller
                  name="signature"
                  control={control}
                  defaultValue=""
                  rules={{ required: t.claim.validation.signatureRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t.claim.signature}
                      error={!!errors.signature}
                      helperText={errors.signature?.message}
                      required
                    />
                  )}
                />
                <Typography variant="body2" color="text.secondary">
                  {t.claim.submissionDate}: {new Date().toLocaleDateString()}
                </Typography>
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
                {t.claim.submitButton}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar Notifications */}
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

export default ClaimForm;