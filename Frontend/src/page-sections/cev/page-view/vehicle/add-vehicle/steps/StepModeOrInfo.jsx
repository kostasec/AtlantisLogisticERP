import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { COMPOSITION_MODES } from '../constants';

export default function StepModeOrInfo({ form, onChange }) {
  if (form.vehicleType === 'composition') {
    return (
      <FormControl fullWidth required>
        <InputLabel>Composition Mode</InputLabel>
        <Select
          value={form.compositionMode}
          onChange={onChange('compositionMode')}
          label="Composition Mode"
        >
          {COMPOSITION_MODES.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // simple vehicle (truck/trailer)
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <TextField label="Make" required fullWidth value={form.make} onChange={onChange('make')} />
      <TextField label="Model" required fullWidth value={form.model} onChange={onChange('model')} />
      <TextField label="Registration Tag" required fullWidth value={form.registrationTag} onChange={onChange('registrationTag')} />
    </Box>
  );
}
