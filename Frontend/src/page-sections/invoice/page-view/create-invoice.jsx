import { memo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'; // MUI

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';


import InvoiceSummary from '../InvoiceSummary';
import InvoiceItems from '../InvoiceItems';
import AdditionalInformation from '../AdditionalInformation';
import { FormProvider, TextField, DatePicker } from '@/components/form'; // STYLED COMPONENTS

import { StatusWrapper, StyledFormControl } from '../styles';
import { AddAPhoto } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
const validationSchema = Yup.object().shape({
  items: Yup.array().of(Yup.object().shape({
    route: Yup.string().required('Route is Required'),
    regTag: Yup.string().required('Registration Tag is Required'),
    price: Yup.string().required('Price is Required'),
    vat: Yup.string().required('VAT is Required'),
    discount: Yup.string().required('Discount is Required'),
    amount: Yup.string().required('Amount is Required')
  })),
  additionalInfo: Yup.object().shape({
    orderNumber: Yup.string(),
    customerReference: Yup.string(),
    projectCode: Yup.string(),
    departmentCode: Yup.string(),
    costCenter: Yup.string(),
    purchaseOrder: Yup.string(),
    contractNumber: Yup.string(),
    deliveryNote: Yup.string(),
    shipmentTracking: Yup.string(),
    specialInstructions: Yup.string()
  })
});
export default function CreateInvoicePageView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleCancel = useCallback(() => navigate('/dashboard/invoice-list'), [navigate]);
  const initialValues = {
    items: [{
      id: 1,
      route: '',
      regTag: '',
      price: '',
      vat: '',
      discount: '',
      amount: ''
    }],
    additionalInfo: {
      orderNumber: '',
      customerReference: '',
      projectCode: '',
      departmentCode: '',
      costCenter: '',
      purchaseOrder: '',
      contractNumber: '',
      deliveryNote: '',
      shipmentTracking: '',
      specialInstructions: ''
    }
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = methods; // FORM SUBMIT HANDLER

  const handleSubmitForm = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2));
  });

  const handleSendInvoice = handleSubmit(values => {
    console.log('Sending invoice:', values);
    // Here you would typically:
    // 1. Save the invoice to the database
    // 2. Send email notification to recipient
    // 3. Update invoice status to 'sent'
    // 4. Redirect to invoice list or show success message
    alert('Invoice sent successfully!');
    navigate('/dashboard/invoice-list');
  });
  return <div className="pt-2 pb-4">
      <Card className="p-3">
        <Typography variant="body1" sx={{
        fontWeight: 500,
        mb: 3
      }}>
          {t('Create Outgoing Invoice')}
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmitForm}>


          {
          /* INVOICE NUMBER */
        }
          <Grid container spacing={3}>
          
          <Grid size={{
            md: 6,
            sm: 6,
            xs: 12
          }}>
          <TextField fullWidth name="invoiceNo" label={t('Invoice Number')} />   
          </Grid>

          <Grid size={{
            md: 1,
            sm: 6,
            xs: 12
          }}>
          <TextField fullWidth name="model" label={t('Model')} />    
          </Grid>

          <Grid size={{
            md: 5,
            sm: 6,
            xs: 12
          }}>
          <TextField fullWidth name="referenceNo" label={t('Reference Number')} />
          </Grid>

          </Grid>

          <Divider sx={{
          mt: 3,
          mb: 2
        }} />

          {
          /* Invoice's dates information */
        }
          <Grid container spacing={3}>
            <Grid size={{
            md: 4,
            sm: 3,
            xs: 12
          }}>
              <Stack spacing={3} >
              <Typography variant="subtitle1" fontWeight={500}>{t('Invoice Information')}</Typography>
              <DatePicker name="issueDate" label={t('Issue Date')} />
              <DatePicker name="transDate" label={t('Transaction Date')} />
              <DatePicker name="dueDate" label={t('Due Date')} />
              </Stack>
            </Grid>

            {/* Empty Space */}
            <Grid size={{
            md: 2,
            sm: 0,
            xs: 0
          }}>
            </Grid>

            {/* Recipient */}
            <Grid size={{
            md: 6,
            sm: 7,
            xs: 12
          }}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={500}>{t('Recipient')}</Typography>

               
                <TextField 
                  fullWidth 
                  name="recipient" 
                  label={t('Recipient')} 
                  helperText={t('Find by Tax Number or Client Name')}
                />
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{
          mt: 4,
          mb: 2
        }} />

          {
          /* ITEM LIST FIELDS */
        }
          <InvoiceItems control={control} />

          <Divider sx={{
          my: 4
        }} />


          <AdditionalInformation />

          <Divider sx={{
          my: 4
        }} />


          <InvoiceSummary />

          <Divider sx={{ my: 4 }} />

          {/* ACTION BUTTONS */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">

            
            <Button 
              type="submit"
              variant="outlined" 
              color="primary"
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              {t('Save Draft')}
            </Button>

            <Button 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
              onClick={handleSendInvoice}
              sx={{ minWidth: 120 }}
            >
              {t('Send Invoice')}
            </Button>
          </Stack>
        </FormProvider>
      </Card>
    </div>;
}