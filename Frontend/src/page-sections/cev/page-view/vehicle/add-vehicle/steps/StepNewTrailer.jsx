import { Box, TextField } from '@mui/material';

export default function StepNewTrailer({ form, onChange }) {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <TextField label="Trailer Make" required fullWidth value={form.trailerMake} onChange={onChange('trailerMake')} />
      <TextField label="Trailer Model" required fullWidth value={form.trailerModel} onChange={onChange('trailerModel')} />
      <TextField label="Trailer Registration Tag" required fullWidth value={form.trailerRegistrationTag} onChange={onChange('trailerRegistrationTag')} />
    </Box>
  );
}
