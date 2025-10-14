import React, { useState, useEffect } from 'react'; //hooks

import {
  Card,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Alert,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'; //comnponents

import HeadingArea from '../../HeadingArea';

import Add from '@/icons/Add'; //icons

//Prikaz iz dropdown-a iz Step-a 1
const VEHICLE_TYPES = [
  { value: 'truck', label: 'Truck' },
  { value: 'trailer', label: 'Trailer' },
  { value: 'composition', label: 'Composition' }
];

//Prikaz iz dropdown-a iz Step-a 2
const COMPOSITION_MODES = [
  { value: 'newTruckExistingTrailer', label: 'Add New Truck to Existing Trailer' },
  { value: 'newTrailerExistingTruck', label: 'Add New Trailer to Existing Truck' },
  { value: 'newComposition', label: 'Create New Composition' }
];

//Mock podaci iz dropdown-a iz Step-a 3
const MOCK = {
  trucks: [
    { value: 'truck1', label: 'Truck SU-789-EF' },
    { value: 'truck2', label: 'Truck SU-012-GH' }
  ],
  trailers: [
    { value: 'trailer1', label: 'Trailer SU-123-AB' },
    { value: 'trailer2', label: 'Trailer SU-456-CD' }
  ]
};

/* Master steps by absolute index */
//Sluzi kao osnova za dinamicku putanju i label-e u Stepper-u
const MASTER_STEPS = [
  { key: 'type', label: 'Select Vehicle Type', description: 'Choose the type of vehicle to add' },                                  // 0
  { key: 'modeOrInfo', label: 'Composition Mode', description: 'Depending on type, select mode or enter info' },                    // 1
  { key: 'existing', label: 'Select Existing Vehicle', description: 'Select truck or trailer to pair with' },                       // 2
  { key: 'newTruckInformation', label: 'New Truck Information', description: 'Enter information for the new truck' },               // 3
  { key: 'newTrailerInformation', label: 'New Trailer Infromation', description: 'Enter information for the new trailer' },         // 4
  { key: 'summary', label: 'Summary', description: 'Review composition and assign driver (optional)' },                             // 5
  { key: 'done', label: 'Done', description: 'Process completed successfully' }                                                     // 6
];

/* ---------- COMPONENT ---------- */
//U okviru ove komponente se definisu lokalna stanja i efekti.
export default function AddVehiclePageView() {
  const [activeStep, setActiveStep] = useState(0); //Stanje za aktivni korak (apsolutni master indeks koji pocinje od 0). Menja se samo preko Next/Back funkcija.
  const [form, setForm] = useState({
    vehicleType: '',
    compositionMode: '',
    existingVehicle: '',
    make: '',
    model: '',
    registrationTag: '',
    truckMake: '',
    truckModel: '',
    truckRegistrationTag: '',
    trailerMake: '',
    trailerModel: '',
    trailerRegistrationTag: '',
    driver: ''
  });
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => resetAll(), []);
    //dinamicka putanja koraka
    const pathSteps = (() => {
    const { vehicleType, compositionMode} = form;

    // nothing chosen yet
    if (!vehicleType) return [0];

    // simple vehicle: add Done as third step
    if (vehicleType === 'truck' || vehicleType === 'trailer') return [0, 1, 6];
   
    // composition, mode not chosen yet
    if (vehicleType === 'composition' && !compositionMode) return [0, 1];

    // composition: completely new composition (no existing)
    if (vehicleType === 'composition' && compositionMode === 'newComposition') return [0, 1, 3, 4, 5, 6];

    // composition: pair new with existing
    if (compositionMode === 'newTruckExistingTrailer') return [0, 1, 2, 3, 5, 6];
    if (compositionMode === 'newTrailerExistingTruck') return [0, 1, 2, 4, 5, 6];

  return [0, 1];
  })();

  // index of active step within current path (for the left Stepper UI)
  const currentPathIndex = Math.max(
  0,
  pathSteps.findIndex((abs) => abs === activeStep)
  );

  /* ---------- FIELD HANDLERS (never advance steps) ---------- */
  const onChange = (field) => (e) => {
    const value = e.target.value;

    if (field === 'vehicleType') {
      // change type ⇒ reset dependent fields but DO NOT advance steps
      setForm({
        vehicleType: value,
        compositionMode: '',
        existingVehicle: '',
        make: '',
        model: '',
        registrationTag: '',
        truckMake: '',
        truckModel: '',
        truckRegistrationTag: '',
        trailerMake: '',
        trailerModel: '',
        trailerRegistrationTag: '',
        driver: ''
      });
      setAvailableVehicles([]);
      setError(null);
      setSuccess(false);
      return;
    }

    if (field === 'compositionMode') {
      // change mode ⇒ set available existing vehicles; keep current step
      setAvailableVehicles(
        value === 'newTruckExistingTrailer'
          ? MOCK.trailers
          : value === 'newTrailerExistingTruck'
          ? MOCK.trucks
          : []
      );
      setForm((p) => ({ ...p, compositionMode: value, existingVehicle: '' }));
      // also reset new vehicle fields when mode changes
      setForm((p) => ({
        ...p,
        truckMake: '', truckModel: '', truckRegistrationTag: '',
        trailerMake: '', trailerModel: '', trailerRegistrationTag: ''
      }));
      return;
    }

    setForm((p) => ({ ...p, [field]: value }));
  };

  /* ---------- NAVIGATION ---------- */
  const next = () => {
    setError(null);

    // validations are based on the absolute master step we are on
    switch (activeStep) {
      case 0: {
        if (!form.vehicleType) return setError('Select a vehicle type.');
        // proceed to the next absolute step (1)
        setActiveStep(1);
        return;
      }
      case 1: {
        if (form.vehicleType === 'composition') {
          if (!form.compositionMode) return setError('Select a composition mode.');
          // go to 2 (existing) or 3 (new details) depending on mode
          setActiveStep(form.compositionMode === 'newComposition' ? 3 : 2);
          return;
        }
        // truck/trailer: require details at this same step then go to Done
        if (!form.make || !form.model || !form.registrationTag)
          return setError('Fill all required fields.');
        setActiveStep(6);
        return;
      }
      case 2: {
        if (!form.existingVehicle) return setError('Select an existing vehicle.');
        // go to appropriate new details step based on mode
        if (form.compositionMode === 'newTruckExistingTrailer') setActiveStep(3);
        else setActiveStep(4);
        return;
      }
      case 3: {
        // step 3: new truck details
        if (!form.truckMake || !form.truckModel || !form.truckRegistrationTag)
          return setError('Fill all required truck fields.');
        if (form.compositionMode === 'newComposition') setActiveStep(4);
        else setActiveStep(5);
        return;
      }
      case 4: {
        // step 4: new trailer details
        if (!form.trailerMake || !form.trailerModel || !form.trailerRegistrationTag)
          return setError('Fill all required trailer fields.');
        setActiveStep(5);
        return;
      }
      case 5: {
        // summary -> submit
        submit();
        return;
      }
      default:
        return;
    }
  };

  const back = () => {
    // move to the previous absolute step that exists in the current path
    const idx = pathSteps.findIndex((abs) => abs === activeStep);
    if (idx > 0) setActiveStep(pathSteps[idx - 1]);
  };

  const resetAll = () => {
    setActiveStep(0);
    setForm({
      vehicleType: '',
      compositionMode: '',
      existingVehicle: '',
      make: '',
      model: '',
      registrationTag: '',
      driver: ''
    });
    setAvailableVehicles([]);
    setError(null);
    setSuccess(false);
  };

  /* ---------- SUBMIT ---------- */
  const submit = async () => {
    try {
      setLoading(true);
      setError(null);
      // API call placeholder
      console.log('Submitting vehicle data:', form);
      setSuccess(true);
      // show done screen for any composition flow
      if (form.vehicleType === 'composition') {
        setActiveStep(6);
      } else {
        // reset for simple flows
        setTimeout(() => resetAll(), 1500);
      }
    } catch (e) {
      setError(e?.message || 'Submit failed.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RIGHT PANEL FIELDS (only for the ACTIVE absolute step) ---------- */
  const renderFields = () => {
    switch (activeStep) {
      case 0:
        return (
          <FormControl fullWidth required>
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              value={form.vehicleType}
              onChange={onChange('vehicleType')}
              label="Vehicle Type"
            >
              {VEHICLE_TYPES.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 1:
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
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }
        if (form.vehicleType === 'truck' || form.vehicleType === 'trailer') {
          return (
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField label="Make" required fullWidth value={form.make} onChange={onChange('make')} />
              <TextField label="Model" required fullWidth value={form.model} onChange={onChange('model')} />
              <TextField label="Registration Tag" required fullWidth value={form.registrationTag} onChange={onChange('registrationTag')} />
            </Box>
          );
        }
        return null;

      case 2:
        return (
          <FormControl fullWidth required>
            <InputLabel>
              {form.compositionMode === 'newTruckExistingTrailer' ? 'Select Trailer' : 'Select Truck'}
            </InputLabel>
            <Select
              value={form.existingVehicle}
              onChange={onChange('existingVehicle')}
              label={form.compositionMode === 'newTruckExistingTrailer' ? 'Select Trailer' : 'Select Truck'}
            >
              {availableVehicles.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 3:
        return (
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField label="Truck Make" required fullWidth value={form.truckMake} onChange={onChange('truckMake')} />
            <TextField label="Truck Model" required fullWidth value={form.truckModel} onChange={onChange('truckModel')} />
            <TextField label="Truck Registration Tag" required fullWidth value={form.truckRegistrationTag} onChange={onChange('truckRegistrationTag')} />
          </Box>
        );

      case 4:
        return (
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField label="Trailer Make" required fullWidth value={form.trailerMake} onChange={onChange('trailerMake')} />
            <TextField label="Trailer Model" required fullWidth value={form.trailerModel} onChange={onChange('trailerModel')} />
            <TextField label="Trailer Registration Tag" required fullWidth value={form.trailerRegistrationTag} onChange={onChange('trailerRegistrationTag')} />
          </Box>
        );

      case 5: {
        // For new composition, show only driver selection (optional)
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
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          );
        }
        // For pairing flows, keep the composition registration preview + driver selection
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
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      }

      case 6: {
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
        // Composition flows: show details and assigned driver (if any)
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
                  <Typography>Truck Make: {form.truckMake} </Typography>
                  <Typography>Truck Model: {form.truckModel}</Typography>
                  <Typography>Truck Registration Tag: {form.truckRegistrationTag}</Typography>
                  
                  <Typography sx={{ mt: 1 }}>Trailer Make: {form.trailerMake}</Typography>
                  <Typography >Trailer Model: {form.trailerModel}</Typography>
                  <Typography>Trailer Registration Tag: {form.trailerRegistrationTag}</Typography>
                </>
              ) : (
                <>
                  <Typography sx={{ mb: 1 }}><strong>Composition:</strong> {pairingSummary}</Typography>
                </>
              )}
              {form.driver && (
                <Typography sx={{ mt: 1 }}><strong>Driver:</strong> {form.driver === 'driver1' ? 'John Doe' : 'Jane Smith'}</Typography>
              )}
            </Box>
            {!form.driver && (
              <Typography variant="body2" color="text.secondary">No driver assigned.</Typography>
            )}
          </Box>
        );
      }

      default:
        return null;
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 8 }}>
      <Card sx={{ px: 3, py: 3, maxWidth: 1200, width: '100%', mx: 'auto' }}>
        <HeadingArea title="Add Vehicle" icon={Add} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
          {/* HORIZONTAL STEPPER ON TOP */}
          <Stepper activeStep={currentPathIndex} orientation="horizontal">
            {pathSteps
              .filter((_, idx) => idx <= currentPathIndex + 1)
              .map((absIndex, idx) => {
              const step = MASTER_STEPS[absIndex];
              const isActive = currentPathIndex === idx;
              // Dynamic label
              let dynamicLabel = step.label;
              // For step 2 (absIndex 1): show 'Enter Information' for simple vehicles, otherwise 'Composition Mode'
              if (absIndex === 1) {
                dynamicLabel = (form.vehicleType === 'truck' || form.vehicleType === 'trailer')
                  ? 'Enter Information'
                  : 'Composition Mode';
              }
              // For step 3 (absIndex 2): rename based on selected composition mode
              if (absIndex === 2 && form.vehicleType === 'composition') {
                dynamicLabel = form.compositionMode === 'newTrailerExistingTruck'
                  ? 'Select Existing Truck'
                  : 'Select Existing Trailer';
              }
              // For step 6 (absIndex 5) in new composition, label should be 'Driver'
              if (absIndex === 5 && form.vehicleType === 'composition' && form.compositionMode === 'newComposition') {
                dynamicLabel = 'Driver';
              }
              return (
                <Step key={step.key}>
                  <StepLabel>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: isActive || currentPathIndex > idx ? 600 : 400 }}
                      color={isActive || currentPathIndex > idx ? 'primary' : 'text.secondary'}
                    >
                      {`${idx + 1}. ${dynamicLabel}`}
                    </Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {/* ACTIVE STEP DESCRIPTION BELOW STEPPER */}
          {(() => {
            const activeAbsIndex = pathSteps[currentPathIndex];
            let descriptionText = MASTER_STEPS[activeAbsIndex]?.description;
            if (activeAbsIndex === 1) {
              descriptionText = (form.vehicleType === 'truck' || form.vehicleType === 'trailer')
                ? 'Enter vehicle details'
                : MASTER_STEPS[activeAbsIndex]?.description;
            }
            // Suppress description for step 5 when creating a new composition
            if (activeAbsIndex === 5 && form.vehicleType === 'composition' && form.compositionMode === 'newComposition') {
              descriptionText = undefined;
            }
            return (
              <Typography variant="body2" color="text.secondary">
                {descriptionText}
              </Typography>
            );
          })()}

          {/* FIELDS UNDER STEPS */}
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          
          <Box display="flex" flexDirection="column" gap={3} sx={{ mb: 2 }}>
            {renderFields()}
          </Box>

          {/* ACTIONS */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button disabled={currentPathIndex === 0 || loading} onClick={back}>Back</Button>
            <Button
              variant="contained"
              onClick={MASTER_STEPS[activeStep]?.key === 'done' ? resetAll : next}
              disabled={loading}
            >
              {MASTER_STEPS[activeStep]?.key === 'done' ? 'Done' : 'Continue'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
