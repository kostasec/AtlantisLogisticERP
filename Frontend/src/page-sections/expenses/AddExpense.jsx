import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Delete from '@/icons/Delete';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
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
  const [items, setItems] = useState([initialExpenseState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateItem = (idx, patch) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };

  const handleItemInputChange = (idx, event) => {
    const { name, value } = event.target;
    if (['domesticAllowance', 'inoAllowance', 'date', 'orderNumber'].includes(name)) {
      updateItem(idx, { [name]: value });
    }
  };

  const handleInnerExpenseChange = (itemIdx, listName, expenseIdx, value) => {
    setItems(prev => prev.map((it, i) => {
      if (i !== itemIdx) return it;
      const updated = [...it[listName]];
      updated[expenseIdx] = value;
      return { ...it, [listName]: updated };
    }));
  };

  const handleAddExpenseField = (itemIdx) => {
    setItems(prev => prev.map((it, i) => i === itemIdx ? { ...it, domesticExpenses: [...it.domesticExpenses, ''] } : it));
  };

  const handleRemoveExpenseField = (itemIdx, idx) => {
    setItems(prev => prev.map((it, i) => i === itemIdx ? { ...it, domesticExpenses: it.domesticExpenses.filter((_, j) => j !== idx) } : it));
  };

  const handleAddInoExpenseField = (itemIdx) => {
    setItems(prev => prev.map((it, i) => i === itemIdx ? { ...it, inoExpenses: [...it.inoExpenses, ''] } : it));
  };

  const handleRemoveInoExpenseField = (itemIdx, idx) => {
    setItems(prev => prev.map((it, i) => i === itemIdx ? { ...it, inoExpenses: it.inoExpenses.filter((_, j) => j !== idx) } : it));
  };

  const handleAddItem = () => {
    setItems(prev => {
      const next = [...prev, JSON.parse(JSON.stringify(initialExpenseState))];
      setCurrentIndex(next.length - 1);
      return next;
    });
  };

  const handleRemoveItem = (idx) => {
    setItems(prev => {
      const next = prev.filter((_, i) => i !== idx);
      // if no items remain, keep one empty item
      if (next.length === 0) {
        setCurrentIndex(0);
        return [JSON.parse(JSON.stringify(initialExpenseState))];
      }
      // adjust currentIndex if out of range
      if (currentIndex >= next.length) {
        setCurrentIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const itemsWithTotals = items.map(it => {
      const totalDomesticExpenses = it.domesticExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0);
      const totalInoExpenses = it.inoExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0);
      const domesticAllowanceTotal = (Number(it.domesticAllowance) * 3000) || 0;
      const inoAllowanceTotal = (Number(it.inoAllowance) * 90) || 0;
      const domesticTotal = domesticAllowanceTotal + totalDomesticExpenses;
      const inoTotal = inoAllowanceTotal + totalInoExpenses;
      const grandTotal = domesticTotal + inoTotal;
      return {
        ...it,
        domesticExpensesSum: totalDomesticExpenses,
        inoExpensesSum: totalInoExpenses,
        domesticTotal,
        inoTotal,
        grandTotal
      };
    });

    const grandSum = itemsWithTotals.map(i => i.grandTotal).reduce((a, b) => a + b, 0);

    onAdd({ items: itemsWithTotals, grandTotal: grandSum });
    setItems([initialExpenseState]);
    onClose();
  };

  const handleClose = () => {
    setItems([initialExpenseState]);
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
        <DialogTitle sx={{ pr: 5 }}>Add Pay Slip</DialogTitle>
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
        <Stack spacing={2}>
          {items.length > 0 && (() => {
            const item = items[currentIndex];
            const itemIdx = currentIndex;
            return (
              <Box key={itemIdx} >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Item {itemIdx + 1} / {items.length}</Typography>
                  <Box>
                    {items.length > 1 && (
                      <IconButton color="error" size="small" onClick={() => handleRemoveItem(itemIdx)}>
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  name="date"
                  value={item.date}
                  onChange={(e) => handleItemInputChange(itemIdx, e)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Order Number"
                  name="orderNumber"
                  value={item.orderNumber}
                  onChange={(e) => handleItemInputChange(itemIdx, e)}
                  sx={{ mb: 1 }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>Domestic</Typography>
                    <TextField
                      fullWidth
                      label={`Allowance (RSD)${item.domesticAllowance ? ` = ${Number(item.domesticAllowance) * 3000} RSD` : ''}`}
                      name="domesticAllowance"
                      type="number"
                      value={item.domesticAllowance}
                      onChange={(e) => handleItemInputChange(itemIdx, e)}
                      sx={{ mb: 2 }}
                      helperText={item.domesticAllowance ? `Total: ${Number(item.domesticAllowance) * 3000} RSD` : 'Enter number of days, will be multiplied by 3000'}
                    />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>Expenses (RSD)</Typography>
                      {item.domesticExpenses.map((val, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TextField
                            fullWidth
                            type="number"
                            value={val}
                            onChange={(e) => handleInnerExpenseChange(itemIdx, 'domesticExpenses', idx, e.target.value)}
                            sx={{ mr: 1 }}
                          />
                          {item.domesticExpenses.length > 1 && (
                            <IconButton onClick={() => handleRemoveExpenseField(itemIdx, idx)} color="error" size="small">
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      <Button onClick={() => handleAddExpenseField(itemIdx)} variant="outlined" size="small">+ Add expense</Button>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Total: {item.domesticExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0)} RSD
                        </Typography>
                      <Box sx={{ my: 2 }}>
                        <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: 0 }} />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                        Grand Total: {
                          (Number(item.domesticAllowance) * 3000 || 0) +
                          item.domesticExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0)
                        } RSD
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>International</Typography>
                    <TextField
                      fullWidth
                      label={`Allowance (EUR)${item.inoAllowance ? ` = ${Number(item.inoAllowance) * 90} EUR` : ''}`}
                      name="inoAllowance"
                      type="number"
                      value={item.inoAllowance}
                      onChange={(e) => handleItemInputChange(itemIdx, e)}
                      sx={{ mb: 2 }}
                      helperText={item.inoAllowance ? `Total: ${Number(item.inoAllowance) * 90} EUR` : 'Enter number of days, will be multiplied by 90'}
                    />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>Expenses (EUR)</Typography>
                      {item.inoExpenses.map((val, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TextField
                            fullWidth
                            type="number"
                            value={val}
                            onChange={(e) => handleInnerExpenseChange(itemIdx, 'inoExpenses', idx, e.target.value)}
                            sx={{ mr: 1 }}
                          />
                          {item.inoExpenses.length > 1 && (
                            <IconButton onClick={() => handleRemoveInoExpenseField(itemIdx, idx)} color="error" size="small">
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      <Button onClick={() => handleAddInoExpenseField(itemIdx)} variant="outlined" size="small">+ Add expense</Button>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Total: {item.inoExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0)} EUR
                        </Typography>
                      <Box sx={{ my: 2 }}>
                        <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: 0 }} />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                        Grand Total: {
                          (Number(item.inoAllowance) * 90 || 0) +
                          item.inoExpenses.map(Number).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0)
                        } EUR
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })()}
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', mt: 2 }}>
          <Box sx={{ justifySelf: 'center' }}>
            <Pagination
              count={items.length}
              page={currentIndex + 1}
              onChange={(e, page) => setCurrentIndex(page - 1)}
              color="primary"
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleAddItem}>+ Add new item</Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
}