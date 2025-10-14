import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const initialExpenseState = {
  date: '',
  orderNumber: '',
  domesticAllowance: '',
  domesticExpenses: [''],
  inoAllowance: '',
  inoExpenses: [''], // now an array
};

export default function AddExpense({ open, onClose, onAdd }) {
  const [newExpense, setNewExpense] = useState(initialExpenseState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'domesticAllowance' || name === 'inoAllowance') {
      setNewExpense(prev => ({
        ...prev,
        [name]: value,
      }));
    } else if (name.startsWith('domesticExpenses')) {
      const idx = Number(name.replace('domesticExpenses', ''));
      const updated = [...newExpense.domesticExpenses];
      updated[idx] = value;
      setNewExpense(prev => ({
        ...prev,
        domesticExpenses: updated
      }));
    } else if (name.startsWith('inoExpenses')) {
      const idx = Number(name.replace('inoExpenses', ''));
      const updated = [...newExpense.inoExpenses];
      updated[idx] = value;
      setNewExpense(prev => ({
        ...prev,
        inoExpenses: updated
      }));
    }
  };

  const handleAddExpenseField = () => {
    setNewExpense(prev => ({
      ...prev,
      domesticExpenses: [...prev.domesticExpenses, '']
    }));
  };

  const handleRemoveExpenseField = (idx) => {
    setNewExpense(prev => ({
      ...prev,
      domesticExpenses: prev.domesticExpenses.filter((_, i) => i !== idx)
    }));
  };

  const handleAddInoExpenseField = () => {
    setNewExpense(prev => ({
      ...prev,
      inoExpenses: [...prev.inoExpenses, '']
    }));
  };

  const handleRemoveInoExpenseField = (idx) => {
    setNewExpense(prev => ({
      ...prev,
      inoExpenses: prev.inoExpenses.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = () => {
    // sum up domesticExpenses and inoExpenses before submit
    const totalDomesticExpenses = newExpense.domesticExpenses
      .map(Number)
      .filter(n => !isNaN(n))
      .reduce((a, b) => a + b, 0);
    const totalInoExpenses = newExpense.inoExpenses
      .map(Number)
      .filter(n => !isNaN(n))
      .reduce((a, b) => a + b, 0);
    onAdd({
      ...newExpense,
      domesticExpenses: totalDomesticExpenses,
      inoExpenses: totalInoExpenses
    });
    setNewExpense(initialExpenseState);
    onClose();
  };

  const handleClose = () => {
    setNewExpense(initialExpenseState);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          position: 'absolute',
          left: '31%',
          top: '15%',
          right: 'auto',
          transform: 'none',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <DialogTitle sx={{ pr: 5 }}>Add New Travel Expense</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'error.main',
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={newExpense.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Order Number"
            name="orderNumber"
            value={newExpense.orderNumber}
            onChange={handleInputChange}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>Domestic</Typography>
              <TextField
                fullWidth
                label={`Allowance (RSD)${newExpense.domesticAllowance ? ` = ${Number(newExpense.domesticAllowance) * 3000} RSD` : ''}`}
                name="domesticAllowance"
                type="number"
                value={newExpense.domesticAllowance}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                helperText={newExpense.domesticAllowance ? `Total: ${Number(newExpense.domesticAllowance) * 3000} RSD` : 'Enter number of days, will be multiplied by 3000'}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Expenses (RSD)</Typography>
                {newExpense.domesticExpenses.map((val, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      fullWidth
                      type="number"
                      name={`domesticExpenses${idx}`}
                      value={val}
                      onChange={handleInputChange}
                      sx={{ mr: 1 }}
                    />
                    {newExpense.domesticExpenses.length > 1 && (
                      <IconButton onClick={() => handleRemoveExpenseField(idx)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button onClick={handleAddExpenseField} variant="outlined" size="small">+ Add expense</Button>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Total: {newExpense.domesticExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0)} RSD
                  </Typography>
                <Box sx={{ my: 2 }}>
                  <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: 0 }} />
                </Box>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                  Grand Total: {
                    (Number(newExpense.domesticAllowance) * 3000 || 0) +
                    newExpense.domesticExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0)
                  } RSD
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>International</Typography>
              <TextField
                fullWidth
                label={`Allowance (EUR)${newExpense.inoAllowance ? ` = ${Number(newExpense.inoAllowance) * 90} EUR` : ''}`}
                name="inoAllowance"
                type="number"
                value={newExpense.inoAllowance}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                helperText={newExpense.inoAllowance ? `Total: ${Number(newExpense.inoAllowance) * 90} EUR` : 'Enter number of days, will be multiplied by 90'}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Expenses (EUR)</Typography>
                {newExpense.inoExpenses.map((val, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      fullWidth
                      type="number"
                      name={`inoExpenses${idx}`}
                      value={val}
                      onChange={handleInputChange}
                      sx={{ mr: 1 }}
                    />
                    {newExpense.inoExpenses.length > 1 && (
                      <IconButton onClick={() => handleRemoveInoExpenseField(idx)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button onClick={handleAddInoExpenseField} variant="outlined" size="small">+ Add expense</Button>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Total: {newExpense.inoExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0)} EUR
                  </Typography>
                <Box sx={{ my: 2 }}>
                  <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: 0 }} />
                </Box>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                  Grand Total: {
                    (Number(newExpense.inoAllowance) * 90 || 0) +
                    newExpense.inoExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0)
                  } EUR
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
}