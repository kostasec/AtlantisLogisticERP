import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import { EXPENSES } from '@/mocks/data/expenses';
import AddExpense from './AddExpense';
import GetWithdrawal from './getWithdrawal';
import { FlexBetween } from '@/components/flexbox';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Invoice from '@/icons/sidebar/Invoice';
import Ecommerce from '@/icons/sidebar/Ecommerce';
import MoneyIcon from '@/icons/MoneyIcon';
import DollarOutlined from '@/icons/DollarOutlined';
import ShoppingCart from '@/icons/ShoppingCart';
import LiteCoin from '@/icons/LiteCoin';
import duotone from '@/icons/duotone';
import Avatar from '@mui/material/Avatar';
import { alpha, styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
const StyledAvatar = styled(Avatar)(({
  theme
}) => ({
  width: 36,
  height: 36,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .icon': {
    fontSize: 22
  }
}));
import Scrollbar from '@/components/scrollbar';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

export default function Expenses() {
  const [selectedDriver, setselectedDriver] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(5);
      useEffect(() => {
        const firstDriver = Object.keys(EXPENSES)[0];
        setselectedDriver(firstDriver);
      }, []);

  function handleSelect(selectedButton) {
    setselectedDriver(selectedButton);
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddExpense = (newExpense) => {
    // Ovde ćemo dodati logiku za čuvanje novog troška
    console.log('New expense:', newExpense);
  };

  let expenseData = [];
  if (selectedDriver) {
    const expense = EXPENSES[selectedDriver];
    if (expense) {
      expenseData = Array.isArray(expense) ? expense : [expense];
    }
  }

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 2, py: 2 }}>
        <Box>
          <FlexBetween flexWrap="wrap" gap={2} px={1} py={1} />
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <StyledAvatar variant="rounded">
              <DollarOutlined color="primary" className="icon" />
            </StyledAvatar>
            <Typography variant="body1" fontWeight={500}>
              Expenses
            </Typography>
          </Stack>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: '8px', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', gap: '8px', flex: 1 }}>
                  {Object.keys(EXPENSES).map((driverName) => (
                    <Button
                      key={driverName}
                      variant={selectedDriver === driverName ? 'contained' : 'outlined'}
                      onClick={() => handleSelect(driverName)}
                      size="medium"
                      sx={{ px: 3 }}
                    >
                      {driverName}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="outlined"
                    size="medium"
                    sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1 }}
                    startIcon={<duotone.Pricing style={{ fontSize: 22 }} />}
                    onClick={() => setIsWithdrawalOpen(true)}
                  >
                    Payment
                  </Button>
                  <Button
                    variant="outlined"
                    size="medium"
                    sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1 }}
                    startIcon={<Invoice style={{ fontSize: 22 }} />}
                  >
                    Transaction History
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {selectedDriver && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleOpenDialog}
                startIcon={<AddIcon />}
              >
                Add Expense
              </Button>
              <Box sx={{ mt: -4, textAlign: 'right' }}>
                <Typography variant="body1" sx={{ color: '#ff6f60', fontWeight: 'bold', display: 'inline' }}>
                  RSD: 123,456
                </Typography>
                <Typography variant="body1" sx={{ color: '#ff6f60', fontWeight: 'bold', display: 'inline' }}>
                  {' | '}
                </Typography>
                <Typography variant="body1" sx={{ color: '#ff6f60', fontWeight: 'bold', display: 'inline' }}>
                  EUR: 789
                </Typography>
              </Box>
            </Box>
          )}
          {selectedDriver && (
            <Box sx={{ mt: 4 }}>
              {expenseData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((exp, index) => (
                <Card
                  key={exp.orderNumber || index}
                  sx={theme => ({
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: theme.palette.mode === 'dark' ? '0 4px 32px 0 rgba(0, 0, 0, 0.7)' : 5
                  })}
                >
                  <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      Order: {exp.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{exp.date}</Typography>
                  </Stack>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary">Domestic</Typography>
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="body2">Allowance (RSD): <b>{exp.domesticAllowance}</b></Typography>
                        <Typography variant="body2">Expenses (RSD): <b>{exp.domesticExpenses}</b></Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="#ff6f60" fontWeight="bold">
                          Grand Total: {(Number(exp.domesticAllowance) + Number(exp.domesticExpenses))} RSD
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary">International</Typography>
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="body2">Allowance (EUR): <b>{exp.inoAllowance}</b></Typography>
                        <Typography variant="body2">Expenses (EUR): <b>{exp.inoExpenses}</b></Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="#ff6f60" fontWeight="bold">
                          Grand Total: {(Number(exp.inoAllowance) + Number(exp.inoExpenses))} EUR
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
              <TablePagination
                component="div"
                count={expenseData.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={e => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
                showFirstButton
                showLastButton
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </Box>

        <AddExpense 
          open={isDialogOpen}
          onClose={handleCloseDialog}
          onAdd={handleAddExpense}
        />
        <GetWithdrawal 
          open={isWithdrawalOpen}
          onClose={() => setIsWithdrawalOpen(false)}
        />
      </Card>
    </div>
  );
}