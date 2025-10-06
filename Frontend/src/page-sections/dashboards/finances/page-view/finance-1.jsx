import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import TransactionTableIncomingInv from '../TransactionTableIncomingInv';
import TransactionTableOutgoingInv from '../TransactionTableOutgoingInv';
import { useTranslation } from 'react-i18next';
import incomingInvoiceService from '@/services/incomingInvoice';
import outgoingInvoiceService from '@/services/outgoingInvoice';

export function Finance1PageView() {
  const { t } = useTranslation();
  const [outgoingInvoices, setOutgoingInvoices] = useState([]);
  const [incomingInvoicesCarriers, setIncomingInvoicesCarriers] = useState([]);
  const [incomingInvoicesOthers, setIncomingInvoicesOthers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        
        // Fetch incoming invoices for carriers
        const carriersResponse = await incomingInvoiceService.getCarrierIncomingInvoices();
        const carriersInvoices = carriersResponse.data || [];
        
        // Fetch incoming invoices for others
        const othersResponse = await incomingInvoiceService.getOtherIncomingInvoices();
        const othersInvoices = othersResponse.data || [];
        
        // Fetch outgoing invoices
        const outgoingResponse = await outgoingInvoiceService.getAllOutgoingInvoices();
        const outgoingInvoicesData = outgoingResponse.data || [];
        
        // Transform carrier invoices to transaction format
        const transformedCarriers = carriersInvoices.map(invoice => ({
          id: invoice.id,
          sender: invoice.sender,
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          amount: invoice.amount,
          currency: invoice.currency // Dodaj currency iz baze
        }));

        // Transform other invoices to transaction format
        const transformedOthers = othersInvoices.map(invoice => ({
          id: invoice.id,
          sender: invoice.sender,
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          amount: invoice.amount,
          currency: invoice.currency // Dodati currency iz baze
        }));

        // Transform outgoing invoices to transaction format
        const transformedOutgoing = outgoingInvoicesData.map(invoice => ({
          id: invoice.id,
          recipient: invoice.recipient, // recipient umesto sender
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          amount: invoice.amount,
          currency: invoice.currency // Dodaj currency iz baze
        }));

        setIncomingInvoicesCarriers(transformedCarriers);
        setIncomingInvoicesOthers(transformedOthers);
        setOutgoingInvoices(transformedOutgoing);
        
      } catch (error) {
        console.error('Error fetching invoice data:', error);
        // Keep empty arrays as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
     
      
        {
        /* II Payment Carriers */
      }
        <Grid size={{
        md: 12,
        xs: 12
      }}>
        <TransactionTableIncomingInv 
          title={t('Incoming Invoices for Payment') || 'Incoming Invoices for Payment'} 
          subtitle={t('Carriers') || 'Carriers'}
          transactions={incomingInvoicesCarriers}
        />
        </Grid>
        {

      /* II Payment Others */
        }
        <Grid size={{
        md: 12,
        xs: 12
      }}>
        <TransactionTableIncomingInv 
          subtitle={t('Others') || 'Others'}
          transactions={incomingInvoicesOthers}
        />
          
        </Grid>

         {
        /*Outgoing Invoices Payment */
      }
        <Grid size={{
        md: 12,
        xs: 12
      }}>
        <TransactionTableOutgoingInv
          title={t('Outgoing Invoices for Payment') || 'Outgoing Invoices for Payment'}
          transactions={outgoingInvoices}
        />
      
          
        </Grid>


        {
        /* QUICK TRANSFER AND INSTALLMENT CARD */
      }
        <Grid size={{
        md: 6,
        xs: 12
      }}>
        {/*Vehicle Inspection*/}

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
       {/*Employee Inspection*/}
         
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