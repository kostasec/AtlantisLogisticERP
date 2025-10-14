import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Delete from '@/icons/Delete';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

export default function GetWithdrawal({ open, onClose }) {
  const driverNames = [
    'Srdjan Horvat',
    'Nebojsa Acimovic',
    'Sabin Kenjeres',
    'Zolt Horvat',
    'Gabor Cirok'
  ];
  // Helper to get today's date in yyyy-mm-dd format
  const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  const [rows, setRows] = useState(
    driverNames.map(name => ({ name, amount: '', date: getToday() }))
  );

  const handleChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { name: '', amount: '', date: '' }]);
  };

  const handleRemoveRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const totalAmount = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <DialogTitle sx={{ pr: 5 }}>Get Withdrawal</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
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
      <DialogContent sx={{ minHeight: 480 }}>
        <Stack spacing={2}>
          {rows.map((row, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                select
                fullWidth
                label="Employee"
                name="name"
                value={row.name}
                onChange={e => handleChange(index, 'name', e.target.value)}
                size="small"
                variant="outlined"
                sx={{ flex: 2 }}
              >
                {driverNames.map((name, idx) => (
                  <MenuItem key={idx} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                value={row.amount}
                onChange={e => handleChange(index, 'amount', e.target.value)}
                size="small"
                type="number"
                variant="outlined"
                sx={{ flex: 1 }}
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={row.date}
                onChange={e => handleChange(index, 'date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                variant="outlined"
                sx={{ flex: 1 }}
              />
              <IconButton color="error" size="small" onClick={() => handleRemoveRow(index)}>
             <Delete />
              </IconButton>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Typography variant="h6" align="left" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
            Total Amount: {totalAmount}
          </Typography>
        </Stack>
      </DialogContent>
      {/* DialogActions removed: no Close button at the bottom */}
    </Dialog>
  );
}
