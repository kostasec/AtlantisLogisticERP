import React from 'react';
import { Card, Box, Button, Stepper, Step, StepLabel, Typography, Alert } from '@mui/material';
import HeadingArea from '@/page-sections/cev/HeadingArea';
import Add from '@/icons/Add';

import { MASTER_STEPS } from './constants';
import { useVehicleForm } from './useVehicleForm';

import StepType from './steps/StepType';
import StepModeOrInfo from './steps/StepModeOrInfo';
import StepExisting from './steps/StepExisting';
import StepNewTruck from './steps/StepNewTruck';
import StepNewTrailer from './steps/StepNewTrailer';
import StepSummary from './steps/StepSummary';
import StepDone from './steps/StepDone';

export default function AddVehiclePageView() {
  const {
    form, onChange, activeStep, currentPathIndex, pathSteps,
    next, back, resetAll, error, loading, availableVehicles
  } = useVehicleForm();

  const renderFields = () => {
    switch (activeStep) {
      case 0: return <StepType form={form} onChange={onChange} />;
      case 1: return <StepModeOrInfo form={form} onChange={onChange} />;
      case 2: return <StepExisting form={form} onChange={onChange} availableVehicles={availableVehicles} />;
      case 3: return <StepNewTruck form={form} onChange={onChange} />;
      case 4: return <StepNewTrailer form={form} onChange={onChange} />;
      case 5: return <StepSummary form={form} onChange={onChange} />;
      case 6: return <StepDone form={form} />;
      default: return null;
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 8 }}>
      <Card sx={{ px: 3, py: 3, maxWidth: 1200, width: '100%', mx: 'auto' }}>
        <HeadingArea title="Add Vehicle" icon={Add} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
          {/* HORIZONTAL STEPPER */}
          <Stepper activeStep={currentPathIndex} orientation="horizontal">
            {pathSteps
              // prikazuj samo aktivni i sledeći
              .filter((_, idx) => idx <= currentPathIndex + 1)
              .map((absIndex, idx) => {
                const step = MASTER_STEPS[absIndex];
                const isActive = currentPathIndex === idx;

                // Dinamične etikete
                let dynamicLabel = step.label;
                if (absIndex === 1) {
                  dynamicLabel = (form.vehicleType === 'truck' || form.vehicleType === 'trailer')
                    ? 'Enter Information'
                    : 'Composition Mode';
                }
                if (absIndex === 2 && form.vehicleType === 'composition') {
                  dynamicLabel = form.compositionMode === 'newTrailerExistingTruck'
                    ? 'Select Existing Truck'
                    : 'Select Existing Trailer';
                }
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

          {/* OPIS AKTIVNOG KORAKA */}
          {(() => {
            const activeAbsIndex = pathSteps[currentPathIndex];
            let descriptionText = MASTER_STEPS[activeAbsIndex]?.description;
            if (activeAbsIndex === 1) {
              descriptionText = (form.vehicleType === 'truck' || form.vehicleType === 'trailer')
                ? 'Enter vehicle details'
                : MASTER_STEPS[activeAbsIndex]?.description;
            }
            if (activeAbsIndex === 5 && form.vehicleType === 'composition' && form.compositionMode === 'newComposition') {
              descriptionText = undefined;
            }
            return (
              <Typography variant="body2" color="text.secondary">
                {descriptionText}
              </Typography>
            );
          })()}

          {/* POLJA */}
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          <Box display="flex" flexDirection="column" gap={3} sx={{ mb: 2 }}>
            {renderFields()}
          </Box>

          {/* DUGMAD */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button disabled={currentPathIndex === 0 || loading} onClick={back}>Back</Button>
            <Button
              variant="contained"
              onClick={absKeyIsDone(activeStep) ? resetAll : next}
              disabled={loading}
            >
              {absKeyIsDone(activeStep) ? 'Done' : 'Continue'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

// Helper da čitamo lepše
function absKeyIsDone(absIndex) {
  return absIndex === 6;
}