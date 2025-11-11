import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { EXPENSES } from '@/mocks/data/expenses';
import AddPaySlip from './AddPaySlip';
import Payment from './Payment';

// Import new components
import ExpensesHeader from './components/ExpensesHeader';
import ExpensesStatistics from './components/ExpensesStatistics';
import ExpensesActions from './components/ExpensesActions';
import PaySlipList from './components/PaySlipList';

export default function ReimbursementMain() {
  const [selectedDriver, setselectedDriver] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paySlips, setPaySlips] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Initialize with first driver
  useEffect(() => {
    const firstDriver = Object.keys(EXPENSES)[0];
    setselectedDriver(firstDriver);
  }, []);

  // Get drivers list
  const drivers = Object.keys(EXPENSES);

  // Event handlers
  const handleDriverSelect = (selectedButton) => {
    setselectedDriver(selectedButton);
    setPage(0); // Reset pagination when switching drivers
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddExpense = (newExpense) => {
    setPaySlips(prev => [newExpense, ...prev]);
    console.log('Added Pay Slip:', newExpense);
  };

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Get expense data for selected driver
  let expenseData = [];
  if (selectedDriver) {
    const expense = EXPENSES[selectedDriver];
    if (expense) {
      expenseData = Array.isArray(expense) ? expense : [expense];
    }
  }

  // Calculate totals for statistics
  const calculateTotals = () => {
    const rsdTotal = expenseData.reduce((sum, exp) => {
      return sum + Number(exp.domesticAllowance || 0) + Number(exp.domesticExpenses || 0);
    }, 0);
    
    const eurTotal = expenseData.reduce((sum, exp) => {
      return sum + Number(exp.inoAllowance || 0) + Number(exp.inoExpenses || 0);
    }, 0);
    
    return { rsdTotal, eurTotal };
  };

  const { rsdTotal, eurTotal } = calculateTotals();

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 2, py: 2 }}>
        {/* Header with driver selection and action buttons */}
        <ExpensesHeader
          drivers={drivers}
          selectedDriver={selectedDriver}
          onDriverSelect={handleDriverSelect}
          onPaymentClick={() => setIsPaymentOpen(true)}
          onTransactionHistoryClick={() => console.log('Transaction History clicked')}
        />

        {/* Add Pay Slip button */}
        <ExpensesActions
          selectedDriver={selectedDriver}
          onAddPaySlip={handleOpenDialog}
        />

        {/* Statistics */}
        <ExpensesStatistics
          rsdTotal={rsdTotal}
          eurTotal={eurTotal}
          showStatistics={!!selectedDriver}
        />

        {/* Pay Slip List */}
        {selectedDriver && (
          <PaySlipList
            expenseData={expenseData}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}

        {/* Dialogs */}
        <AddPaySlip 
          open={isDialogOpen}
          onClose={handleCloseDialog}
          onAdd={handleAddExpense}
        />
        
        <Payment 
          open={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
        />
      </Card>
    </div>
  );
}