import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { VEHICLE_TYPES } from '../constants';

export default function StepType({ form, onChange }) {
  return (
    <FormControl fullWidth required>
      <InputLabel>Vehicle Type</InputLabel>
      <Select value={form.vehicleType} onChange={onChange('vehicleType')} label="Vehicle Type">
        {VEHICLE_TYPES.map((o) => (
          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}