import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

const INSPECTION_TYPES = [
  'Technical Inspection',
  'Registration',
  'Insurance',
  'Tachograph',
  'Fire Extinguisher',
  'First Aid Kit',
  'ADR Certificate',
  'Driver License'
];

const MOCK_VEHICLES = [
  'NS-123-AB',
  'NS-456-CD', 
  'NS-789-EF',
  'NS-321-GH',
  'BG-111-AA',
  'BG-222-BB'
];

export default function AddInspectionDialog({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    inspectionType: '',
    lastInspection: '',
    nextInspection: '',
    inspector: '',
    cost: '',
    reminderDays: 30
  });

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.vehicleId || !formData.inspectionType || !formData.nextInspection) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      vehicleId: '',
      inspectionType: '',
      lastInspection: '',
      nextInspection: '',
      inspector: '',
      cost: '',
      reminderDays: 30
    });
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
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <DialogTitle sx={{ pr: 5 }}>Add New Inspection</DialogTitle>
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {/* Vehicle Selection */}
            <FormControl fullWidth required>
              <InputLabel>Vehicle ID</InputLabel>
              <Select
                value={formData.vehicleId}
                onChange={handleInputChange('vehicleId')}
                label="Vehicle ID"
              >
                {MOCK_VEHICLES.map((vehicle) => (
                  <MenuItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Inspection Type */}
            <FormControl fullWidth required>
              <InputLabel>Inspection Type</InputLabel>
              <Select
                value={formData.inspectionType}
                onChange={handleInputChange('inspectionType')}
                label="Inspection Type"
              >
                {INSPECTION_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Last Inspection Date */}
            <TextField
              fullWidth
              label="Last Inspection Date"
              type="date"
              value={formData.lastInspection}
              onChange={handleInputChange('lastInspection')}
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* Next Inspection Date */}
            <TextField
              fullWidth
              label="Next Inspection Date"
              type="date"
              value={formData.nextInspection}
              onChange={handleInputChange('nextInspection')}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* Inspector/Institution */}
            <TextField
              fullWidth
              label="Inspector/Institution"
              value={formData.inspector}
              onChange={handleInputChange('inspector')}
              placeholder="e.g., Auto Centar Miloš"
            />

            {/* Cost */}
            <TextField
              fullWidth
              label="Cost (RSD)"
              type="number"
              value={formData.cost}
              onChange={handleInputChange('cost')}
              placeholder="0.00"
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 3 }}>
            <Button 
              onClick={handleSave} 
              variant="contained"
              disabled={!formData.vehicleId || !formData.inspectionType || !formData.nextInspection}
            >
              Save Inspection
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      
      {/* Extra spacing */}
      <Box sx={{ pb: 2 }} />
    </Dialog>
  );
}