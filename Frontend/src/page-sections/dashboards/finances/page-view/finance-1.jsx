import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack'; // CUSTOM PAGE SECTION COMPONENTS

import TransactionTable from '../TransactionTable';
export function Finance1PageView() {
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
      {
        /*Outgoing Invoices Payment */
      }
        <Grid size={{
        md: 12,
        xs: 12
      }}>
        <TransactionTable title="Outgoing Invoices for Payment"/>
          
        </Grid>
      
        {
        /* II Payment Carriers */
      }
        <Grid size={{
        md: 6,
        xs: 12
      }}>
        <TransactionTable title="Incoming Invoices for Payment" subtitle="Carriers"/>
        </Grid>
        {

      /* II Payment Others */
        }
        <Grid size={{
        md: 6,
        xs: 12
      }}>
        <TransactionTable title="Incoming Invoices for Payment" subtitle="Others"/>
          
        </Grid>


        {
        /* QUICK TRANSFER AND INSTALLMENT CARD */
      }
        <Grid size={{
        md: 6,
        xs: 12
      }}>
        <TransactionTable title="Vehicle Inspection" />

          <Stack spacing={3}>
           
          </Stack>
        </Grid>

        {
        /* CUSTOMER TRANSACTION TABLE */
      }
        <Grid size={{
        md: 6,
        xs: 12
      }}>
        <TransactionTable title="Employee Inspection" />
         
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

      </Grid>
    </div>;
}