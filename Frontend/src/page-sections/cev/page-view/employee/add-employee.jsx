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

import { employeeService } from '@/services/employeeService';

import ReceiptOutlined from '@/icons/ReceiptOutlined';
import Key from '@/icons/Key';
import HomeOutlined from '@/icons/HomeOutlined';
import Email from '@/icons/Email';
import User from '@/icons/User';
import Phone from '@/icons/Call';
import Add from '@/icons/Add';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  streetAndNumber: yup.string().required('Street and number is required'),
  city: yup.string().required('City is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  passportNumber: yup.string().required('Passport number is required')
});

export default function AddEmployeePageView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Keep fields from shrinking when the Card becomes narrower
  const fieldSx = { minWidth: 600, flexShrink: 0 };
  const wideFieldSx = { minWidth: 800, flexShrink: 0 };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      streetAndNumber: '',
      city: 'Subotica',
      zipCode: '24000',
      country: 'Serbia',
      phoneNumber: '',
      passportNumber: '',
      emplType: 'Driver'
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare Employee data
      const EmployeeData = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: `${data.streetAndNumber}, ${data.city}, ${data.zipCode}, ${data.country}`,
        phoneNumber: data.phoneNumber,
        passportNumber: data.passportNumber
      };

      const response = await employeeService.createEmployee(EmployeeData);
      
      if (response.success) {
        setSuccess(true);
        reset();
        setTimeout(() => {
          navigate('/dashboard/employee');
        }, 2000);
      } else {
        setError(response.message || 'Failed to create Employee');
      }
    } catch (err) {
      console.error('Error creating Employee:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/employee');
  };

  return (
    <Box display="flex" justifyContent="center" className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 3, maxWidth: 850 }}>
      <HeadingArea title={t('Add Employee')} icon={Add} />
          
        <Box sx={{ mt: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Employee created successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('First Name')}
                      sx={wideFieldSx}
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Last Name')}
                      sx={wideFieldSx}
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid>
                <Controller
                  name="emplType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Employee Type')}
                      sx={wideFieldSx}
                      fullWidth
                      error={!!errors.emplType}
                      helperText={errors.emplType?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid>
                <Controller
                  name="streetAndNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Street and Number')}
                      sx={wideFieldSx}
                      fullWidth
                      error={!!errors.streetAndNumber}
                      helperText={errors.streetAndNumber?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('City')}
                      sx={wideFieldSx}
                      fullWidth
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid>
                <Controller
                  name="zipCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('ZIP Code')}
                      sx={wideFieldSx}
                      fullWidth
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                    />
                  )}
                />
              </Grid>

              <Grid>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Country')}
                      sx={wideFieldSx}
                      fullWidth
                      error={!!errors.country}
                      helperText={errors.country?.message}
                    />
                  )}
                />
              </Grid>

              <Grid>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Phone Number')}
                      sx={wideFieldSx}
                      fullWidth
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                    />
                  )}
                />
              </Grid>

              <Grid>
                <Controller
                  name="passportNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Passport Number')}
                      sx={wideFieldSx}
                      fullWidth
                      error={!!errors.passportNumber}
                      helperText={errors.passportNumber?.message}
                    />
                  )}
                />
              </Grid>

            <Grid>
            <Controller
                name="vehicle"
                control={control}
                render={({ field }) => (
                <TextField
                    {...field}
                    select
                    label="Vehicle"
          sx={wideFieldSx}
                    fullWidth
                    error={!!errors.vehicle}
                    helperText={errors.vehicle?.message}
                >
                  <MenuItem value="v1">V1</MenuItem>
                  <MenuItem value="v2">V2</MenuItem>
                  </TextField>
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
                {loading ? 'Creating...' : 'Create Employee'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}