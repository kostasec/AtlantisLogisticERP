import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import PrintIcon from '@mui/icons-material/Print';
import PaySlipCard from './PaySlipCard';

export default function PaySlipList({ 
  expenseData,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) {
  if (!expenseData || expenseData.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Card sx={theme => ({ mb: 3, p: 2, borderRadius: 2, border: `2px solid ${theme.palette.divider}` })}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No expenses found for selected driver
          </Typography>
        </Card>
      </Box>
    );
  }

  const paginatedData = expenseData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ mt: 4 }}>
      <Card
        sx={theme => ({
          mb: 3,
          p: 2,
          borderRadius: 2,
          border: `2px solid ${theme.palette.divider}`
        })}
      >
        {/* Pay Slip Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" fontWeight={700} color="primary">
            Pay Slip
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Stack>

        {/* Render Pay Slip Cards */}
        {paginatedData.map((expense, index) => (
          <PaySlipCard 
            key={expense.orderNumber || index} 
            expense={expense} 
            index={index} 
          />
        ))}
      </Card>

      {/* Pagination */}
      <Box sx={{ mt: 2 }}>
        <TablePagination
          component="div"
          count={expenseData.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
          showFirstButton
          showLastButton
          sx={{ mt: 2 }}
        />
      </Box>
    </Box>
  );
}