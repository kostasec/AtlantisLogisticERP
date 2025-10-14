import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';

import HeadingArea from '../../HeadingArea';

import { clientService } from '@/services/clientService';

import ReceiptOutlined from '@/icons/ReceiptOutlined';
import Key from '@/icons/Key';
import HomeOutlined from '@/icons/HomeOutlined';
import Email from '@/icons/Email';
import User from '@/icons/User';
import Phone from '@/icons/Call';
import Add from '@/icons/Add';

const validationSchema = yup.object({
  clientName: yup.string().required('Client name is required'),
  taxId: yup.string().required('Tax ID is required'),
  regNmbr: yup.string().required('Registration number is required'),
  streetAndNumber: yup.string().required('Street and number is required'),
  city: yup.string().required('City is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
  clientType: yup.string().required('Client type is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  // Contact person fields (optional)
  contactPersonName: yup.string(),
  contactPersonDescription: yup.string(),
  contactPersonPhone: yup.string(),
  contactPersonEmail: yup.string().email('Invalid email format')
});

export default function AddClientPageView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      clientName: '',
      taxId: '',
      regNmbr: '',
      streetAndNumber: '',
      city: '',
      zipCode: '',
      country: 'Serbia',
      clientType: '',
      email: '',
      contactPersonName: '',
      contactPersonDescription: '',
      contactPersonPhone: '',
      contactPersonEmail: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare client data
      const clientData = {
        clientName: data.clientName,
        taxId: data.taxId,
        regNmbr: data.regNmbr,
        adress: `${data.streetAndNumber}, ${data.city}, ${data.zipCode}, ${data.country}`,
        email: data.email,
        clientType: data.clientType,
        contactPerson: (data.contactPersonName || data.contactPersonPhone || data.contactPersonEmail) ? {
          name: data.contactPersonName || '',
          description: data.contactPersonDescription || '',
          phoneNumber: data.contactPersonPhone || '',
          email: data.contactPersonEmail || ''
        } : null
      };

      const response = await clientService.createClient(clientData);
      
      if (response.success) {
        setSuccess(true);
        reset();
        setTimeout(() => {
          navigate('/dashboard/client');
        }, 2000);
      } else {
        setError(response.message || 'Failed to create client');
      }
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/client');
  };

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 3 }}>
      <HeadingArea title={t('Add Client')} icon={Add} />
          
        <Box sx={{ mt: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Client created successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Basic Client Information */}
            <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <User sx={{ fontSize: 20 }} />
              Basic Information
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Client Name"
                      fullWidth
                      error={!!errors.clientName}
                      helperText={errors.clientName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="clientType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Client Type"
                      fullWidth
                      error={!!errors.clientType}
                      helperText={errors.clientType?.message}
                    >
                      <MenuItem value="Transportation">Transportation</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="taxId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Tax ID')}
                      fullWidth
                      error={!!errors.taxId}
                      helperText={errors.taxId?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="regNmbr"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Registration Number')}
                      fullWidth
                      
                      error={!!errors.regNmbr}
                      helperText={errors.regNmbr?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Address Information */}
            <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeOutlined sx={{ fontSize: 20 }} />
              Address Information
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 3 }}>
                <Controller
                  name="streetAndNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Street and Number"
                      fullWidth
                      error={!!errors.streetAndNumber}
                      helperText={errors.streetAndNumber?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 3 }}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="City"
                      fullWidth
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 3}}>
                <Controller
                  name="zipCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ZIP Code"
                      fullWidth
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 3}}>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Country"
                      fullWidth
                      error={!!errors.country}
                      helperText={errors.country?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Contact Person (Optional) */}
            <Typography variant="h6" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: 20 }} />
              Contact Person (Optional)
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 3}}>
                <Controller
                  name="contactPersonName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact Person Name"
                      fullWidth
                      error={!!errors.contactPersonName}
                      helperText={errors.contactPersonName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 3 }}>
                <Controller
                  name="contactPersonDescription"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description/Title"
                      fullWidth
                      error={!!errors.contactPersonDescription}
                      helperText={errors.contactPersonDescription?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 3 }}>
                <Controller
                  name="contactPersonPhone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      error={!!errors.contactPersonPhone}
                      helperText={errors.contactPersonPhone?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 3 }}>
                <Controller
                  name="contactPersonEmail"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact Email"
                      type="email"
                      fullWidth
                      error={!!errors.contactPersonEmail}
                      helperText={errors.contactPersonEmail?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
              <Button 
                variant="outlined" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Client'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </div>
  );
}