import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';


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
          currency: invoice.currency
        }));

        // Transform other invoices to transaction format
        const transformedOthers = othersInvoices.map(invoice => ({
          id: invoice.id,
          sender: invoice.sender,
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          amount: invoice.amount,
          currency: invoice.currency
        }));

        // Transform outgoing invoices to transaction format
        const transformedOutgoing = outgoingInvoicesData.map(invoice => ({
          id: invoice.id,
          recipient: invoice.recipient,
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          amount: invoice.amount,
          currency: invoice.currency
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
  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {/* Incoming Invoices - Carriers */}
        <Grid size={{ xs: 12, md: 12 }}>
          <TransactionTableIncomingInv 
            title={t('Incoming Invoices for Payment')} 
            subtitle={t('Carriers')}
            transactions={incomingInvoicesCarriers}
          />
        </Grid>

        {/* Incoming Invoices - Others */}
        <Grid size={{ xs: 12, md: 12 }}>
          <TransactionTableIncomingInv 
            subtitle={t('Others')}
            transactions={incomingInvoicesOthers}
          />
        </Grid>

        {/* Outgoing Invoices */}
        <Grid size={{ xs: 12, md: 12 }}>
          <TransactionTableOutgoingInv
            title={t('Outgoing Invoices for Payment')}
            transactions={outgoingInvoices}
          />
        </Grid>
      </Grid>
    </div>
  );
}