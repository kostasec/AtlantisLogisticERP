import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FlexBetween } from '@/components/flexbox';
import Invoice from '@/icons/sidebar/Invoice';
import duotone from '@/icons/duotone';

export default function ExpensesHeader({ 
  drivers, 
  selectedDriver, 
  onDriverSelect, 
  onPaymentClick, 
  onTransactionHistoryClick 
}) {
  return (
    <Box>
      <FlexBetween flexWrap="wrap" gap={1}  py={0.5} />
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
        <Typography variant="h5" fontWeight={600}>
          Expenses
        </Typography>
      </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Recordkeeping and creation of payslips for daily allowances and travel expenses
        </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: '8px', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {/* Driver Selection Buttons */}
            <Box sx={{ display: 'flex', gap: '8px', flex: 1 }}>
              {drivers.map((driverName) => (
                <Button
                  key={driverName}
                  variant={selectedDriver === driverName ? 'contained' : 'outlined'}
                  onClick={() => onDriverSelect(driverName)}
                  size="medium"
                  sx={{ px: 3 }}
                >
                  {driverName}
                </Button>
              ))}
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="outlined"
                size="medium"
                sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1 }}
                startIcon={<duotone.Pricing style={{ fontSize: 22 }} />}
                onClick={onPaymentClick}
              >
                Payment
              </Button>
              <Button
                variant="outlined"
                size="medium"
                sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1 }}
                startIcon={<Invoice style={{ fontSize: 22 }} />}
                onClick={onTransactionHistoryClick}
              >
                Transaction History
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}