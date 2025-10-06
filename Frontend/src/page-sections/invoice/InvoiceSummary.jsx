import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography'; // CUSTOM COMPONENTS

import FlexBetween from '@/components/flexbox/FlexBetween'; // CUSTOM UTILS METHOD

import { currency } from '@/utils/currency';
import { parseEuropeanNumber } from '@/utils/numberFormat';

export default function InvoiceSummary() {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const items = useWatch({ control, name: 'items' }) || [];

  // Funkcija za mapiranje VAT koda u procenat
  const getVATPercentage = (vatCode) => {
    switch (vatCode) {
      case 'VAT 10%': return 0.10;
      case 'VAT 20%': return 0.20;
      case 'NO VAT - IMPORT':
      case 'NO VAT - EXPORT': 
      case 'NO VAT - FOREIGN':
      default: return 0.00;
    }
  };

    // Logika za obračun PDV-a i ukupnih iznosa
    const calculations = items.reduce((acc, item) => {
    const price = parseEuropeanNumber(item.price);
    const discount = parseEuropeanNumber(item.discount) / 100; // Convert percentage to decimal
    const vatPercentage = getVATPercentage(item.vat);
    
    // TaxBase - osnovica
    acc.taxBase += price;
    
    // Discount amount - iznos popusta
    acc.discountAmount += price * discount;
    
    // Subtotal - osnovica nakon popusta
    const subtotalItem = price * (1 - discount);
    acc.subtotal += subtotalItem;
    
    // VAT Amount - iznos PDV-a
    acc.vatAmount += subtotalItem * vatPercentage;
    
    // Total Amount - ukupan iznos sa PDV-om
    acc.totalAmount += subtotalItem * (1 + vatPercentage);
    
    return acc;
  }, {
    taxBase: 0,
    discountAmount: 0,
    subtotal: 0,
    vatAmount: 0,
    totalAmount: 0
  });

  // Formatiranje brojeva na 2 decimale
  const formatAmount = (amount) => parseFloat(amount.toFixed(2));

  const {
    taxBase,
    discountAmount,
    subtotal,
    vatAmount,
    totalAmount
  } = calculations;
  return <Box maxWidth={320}>
      <Typography variant="body1" fontWeight={500}>
        {t('Amount')}
      </Typography>

  <SummaryItem label={t('Tax Base')} value={currency(formatAmount(taxBase))} />
  <SummaryItem label={t('Subtotal')} value={currency(formatAmount(subtotal))} />
      {discountAmount > 0 && (
  <SummaryItem label={t('Discount')} value={currency(-formatAmount(discountAmount))} />
      )}
      {vatAmount > 0 && (
  <SummaryItem label={t('VAT')} value={currency(formatAmount(vatAmount))} />
      )}
      <Divider sx={{
        my: 2
      }} />
  <SummaryItem label={t('Total')} value={currency(formatAmount(totalAmount))} />
    </Box>;
}

function SummaryItem({
  label,
  value
}) {
  return <FlexBetween my={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </FlexBetween>;
}