import { Box, TextField } from '@mui/material';

export default function StepNewTruck({ form, onChange }) {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <TextField label="Truck Make" required fullWidth value={form.truckMake} onChange={onChange('truckMake')} />
      <TextField label="Truck Model" required fullWidth value={form.truckModel} onChange={onChange('truckModel')} />
      <TextField label="Truck Registration Tag" required fullWidth value={form.truckRegistrationTag} onChange={onChange('truckRegistrationTag')} />
    </Box>
  );
}
