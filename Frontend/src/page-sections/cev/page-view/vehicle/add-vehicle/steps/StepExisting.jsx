import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function StepExisting({ form, onChange, availableVehicles }) {
  const isTruckPairing = form.compositionMode === 'newTrailerExistingTruck';
  return (
    <FormControl fullWidth required>
      <InputLabel>{isTruckPairing ? 'Select Truck' : 'Select Trailer'}</InputLabel>
      <Select
        value={form.existingVehicle}
        onChange={onChange('existingVehicle')}
        label={isTruckPairing ? 'Select Truck' : 'Select Trailer'}
      >
        {availableVehicles.map((o) => (
          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
