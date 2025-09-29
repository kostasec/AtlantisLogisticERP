import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack'; // CUSTOM PAGE SECTION COMPONENTS

import Footer from '../../_common/Footer';
import CustomerTransaction from '../CustomerTransaction';
export default function Finance1PageView() {
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {
        /* II Payment Carries */
      }
        <Grid size={{
        md: 6,
        xs: 12
      }}>
        <CustomerTransaction title="Incoming Invoices for Payment" subtitle="Carries"/>
        </Grid>
        {
      /* II Payment Others */
        }
        <Grid size={{
        md: 6,
        xs: 12
      }}>
        <CustomerTransaction title="Incoming Invoices for Payment" subtitle="Others"/>
          
        </Grid>

        {
        /* TRANSACTION CHART CARD */
      }
        <Grid size={{
        md: 8,
        xs: 12
      }}>
          
        </Grid>

        {
        /* YOUR CARD  */
      }
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          
        </Grid>

        {
        /* QUICK TRANSFER AND INSTALLMENT CARD */
      }
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          <Stack spacing={3}>
           
          </Stack>
        </Grid>

        {
        /* CUSTOMER TRANSACTION TABLE */
      }
        <Grid size={{
        md: 8,
        xs: 12
      }}>
         
        </Grid>

        {
        /* INVESTMENT CHART CARD */
      }
        <Grid size={{
        md: 8,
        xs: 12
      }}>
          
        </Grid>

        {
        /* TOP ACTIVITY CARD */
      }
        <Grid size={{
        md: 4,
        xs: 12
      }}>
         
        </Grid>

        {
        /* MY SAVINGS CARD */
      }
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          
        </Grid>

        {
        /* AUDITS CARD */
      }
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          
        </Grid>

        {
        /* REPORTS CARD */
      }
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          
        </Grid>

        {
        /* FOOTER CARD */
      }
        <Grid size={12}>
          <Footer />
        </Grid>
      </Grid>
    </div>;
}