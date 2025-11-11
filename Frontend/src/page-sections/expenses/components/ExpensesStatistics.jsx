import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ExpensesStatistics({ 
  rsdTotal = 0, 
  eurTotal = 0,
  showStatistics = true 
}) {
  if (!showStatistics) return null;

  return (
    <Box sx={{ mt: -4, textAlign: 'right', mb: 2 }}>
      <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 'bold', display: 'inline' }}>
        RSD: {rsdTotal.toLocaleString()}
      </Typography>
      <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 'bold', display: 'inline' }}>
        {' | '}
      </Typography>
      <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 'bold', display: 'inline' }}>
        EUR: {eurTotal.toLocaleString()}
      </Typography>
    </Box>
  );
}