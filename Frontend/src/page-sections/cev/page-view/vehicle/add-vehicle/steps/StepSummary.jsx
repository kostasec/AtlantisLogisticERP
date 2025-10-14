import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { MOCK } from '../constants';

export default function StepSummary({ form, onChange }) {
  // newComposition → samo driver
  if (form.compositionMode === 'newComposition') {
    return (
      <Box>
        <FormControl fullWidth>
          <InputLabel>Assign Driver (Optional)</InputLabel>
          <Select value={form.driver} onChange={onChange('driver')} label="Assign Driver (Optional)">
            {[
              { value: 'driver1', label: 'John Doe' },
              { value: 'driver2', label: 'Jane Smith' }
            ].map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  // pair flows → prikaz registracije + driver
  let compLabel = '';
  if (form.compositionMode === 'newTruckExistingTrailer') {
    const existingLabel = MOCK.trailers.find((v) => v.value === form.existingVehicle)?.label;
    const existingReg = existingLabel ? existingLabel.split(' ')[1] : '';
    compLabel = `${form.truckRegistrationTag || 'TRK'}/${existingReg}`;
  } else if (form.compositionMode === 'newTrailerExistingTruck') {
    const existingLabel = MOCK.trucks.find((v) => v.value === form.existingVehicle)?.label;
    const existingReg = existingLabel ? existingLabel.split(' ')[1] : '';
    compLabel = `${existingReg}/${form.trailerRegistrationTag || 'TRL'}`;
  }

  return (
    <Box>
      <Typography sx={{ mb: 2 }}>Composition Registration: {compLabel}</Typography>
      <FormControl fullWidth>
        <InputLabel>Assign Driver (Optional)</InputLabel>
        <Select value={form.driver} onChange={onChange('driver')} label="Assign Driver (Optional)">
          {[
            { value: 'driver1', label: 'John Doe' },
            { value: 'driver2', label: 'Jane Smith' }
          ].map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
