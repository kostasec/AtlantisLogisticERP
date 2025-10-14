import { Box, Typography } from '@mui/material';
import { MOCK } from '../constants';

export default function StepDone({ form }) {
  if (form.vehicleType === 'truck' || form.vehicleType === 'trailer') {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>Done</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The vehicle has been entered.
        </Typography>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography><strong>Type:</strong> {form.vehicleType === 'truck' ? 'Truck' : 'Trailer'}</Typography>
          <Typography><strong>Make:</strong> {form.make}</Typography>
          <Typography><strong>Model:</strong> {form.model}</Typography>
          <Typography><strong>Registration:</strong> {form.registrationTag}</Typography>
        </Box>
      </Box>
    );
  }

  const isNewComposition = form.compositionMode === 'newComposition';
  let pairingSummary = '';
  if (!isNewComposition) {
    if (form.compositionMode === 'newTruckExistingTrailer') {
      const existingLabel = MOCK.trailers.find((v) => v.value === form.existingVehicle)?.label;
      const existingReg = existingLabel ? existingLabel.split(' ')[1] : '';
      pairingSummary = `${form.truckRegistrationTag || 'TRK'}/${existingReg}`;
    } else if (form.compositionMode === 'newTrailerExistingTruck') {
      const existingLabel = MOCK.trucks.find((v) => v.value === form.existingVehicle)?.label;
      const existingReg = existingLabel ? existingLabel.split(' ')[1] : '';
      pairingSummary = `${existingReg}/${form.trailerRegistrationTag || 'TRL'}`;
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Done</Typography>
      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
        {isNewComposition ? (
          <>
            <Typography sx={{ mb: 1 }}><strong>New Composition:</strong></Typography>
            <Typography>Truck Make: {form.truckMake}</Typography>
            <Typography>Truck Model: {form.truckModel}</Typography>
            <Typography>Truck Registration Tag: {form.truckRegistrationTag}</Typography>
            <Typography sx={{ mt: 1 }}>Trailer Make: {form.trailerMake}</Typography>
            <Typography>Trailer Model: {form.trailerModel}</Typography>
            <Typography>Trailer Registration Tag: {form.trailerRegistrationTag}</Typography>
          </>
        ) : (
          <Typography sx={{ mb: 1 }}><strong>Composition:</strong> {pairingSummary}</Typography>
        )}
        {form.driver && (
          <Typography sx={{ mt: 1 }}><strong>Driver:</strong> {form.driver === 'driver1' ? 'John Doe' : 'Jane Smith'}</Typography>
        )}
      </Box>
      {!form.driver && <Typography variant="body2" color="text.secondary">No driver assigned.</Typography>}
    </Box>
  );
}
