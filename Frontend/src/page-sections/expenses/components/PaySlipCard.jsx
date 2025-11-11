import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function PaySlipCard({ expense, index }) {
  const domesticTotal = Number(expense.domesticAllowance || 0) + Number(expense.domesticExpenses || 0);
  const internationalTotal = Number(expense.inoAllowance || 0) + Number(expense.inoExpenses || 0);

  return (
    <Card
      key={expense.orderNumber || index}
      sx={theme => ({
        mb: 3,
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      })}
    >
      <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <Typography variant="h7" fontWeight={700} color="primary">
          Order: {expense.orderNumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {expense.date}
        </Typography>
      </Stack>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {/* Domestic Section */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" color="primary">
            Domestic
          </Typography>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Typography variant="body2">
              Allowance (RSD): <b>{expense.domesticAllowance}</b>
            </Typography>
            <Typography variant="body2">
              Expenses (RSD): <b>{expense.domesticExpenses}</b>
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="error.main" fontWeight="bold">
              Grand Total: {domesticTotal} RSD
            </Typography>
          </Box>
        </Box>
        
        {/* International Section */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" color="primary">
            International
          </Typography>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Typography variant="body2">
              Allowance (EUR): <b>{expense.inoAllowance}</b>
            </Typography>
            <Typography variant="body2">
              Expenses (EUR): <b>{expense.inoExpenses}</b>
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="error.main" fontWeight="bold">
              Grand Total: {internationalTotal} EUR
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}