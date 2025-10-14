/*This file is a custom hook */

import { useEffect, useState } from 'react';
import { MOCK } from './constants';

export function useVehicleForm() {
  const [activeStep, setActiveStep] = useState(0);
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

  // Dinamička putanja koraka
  const pathSteps = (() => {
    const { vehicleType, compositionMode } = form;

    if (!vehicleType) return [0]; // ništa izabrano → samo prvi
    if (vehicleType === 'truck' || vehicleType === 'trailer') return [0, 1, 6];
    if (vehicleType === 'composition' && !compositionMode) return [0, 1];
    if (vehicleType === 'composition' && compositionMode === 'newComposition') return [0, 1, 3, 4, 5, 6];
    if (compositionMode === 'newTruckExistingTrailer') return [0, 1, 2, 3, 5, 6];
    if (compositionMode === 'newTrailerExistingTruck') return [0, 1, 2, 4, 5, 6];

    return [0, 1];
  })();

  // indeks unutar trenutne putanje
  const currentPathIndex = Math.max(0, pathSteps.findIndex(abs => abs === activeStep));

  /* -------- FIELD HANDLERS (ne menjaju korak) -------- */
  const onChange = (field) => (e) => {
    const value = e.target.value;

    if (field === 'vehicleType') {
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
      setAvailableVehicles(
        value === 'newTruckExistingTrailer'
          ? MOCK.trailers
          : value === 'newTrailerExistingTruck'
          ? MOCK.trucks
          : []
      );
      // očisti povezane vrednosti
      setForm((p) => ({
        ...p,
        compositionMode: value,
        existingVehicle: '',
        truckMake: '',
        truckModel: '',
        truckRegistrationTag: '',
        trailerMake: '',
        trailerModel: '',
        trailerRegistrationTag: ''
      }));
      return;
    }

    setForm((p) => ({ ...p, [field]: value }));
  };

  /* -------- NAVIGACIJA -------- */
  const next = () => {
    setError(null);

    switch (activeStep) {
      case 0: {
        if (!form.vehicleType) return setError('Select a vehicle type.');
        setActiveStep(1);
        return;
      }
      case 1: {
        if (form.vehicleType === 'composition') {
          if (!form.compositionMode) return setError('Select a composition mode.');
          setActiveStep(form.compositionMode === 'newComposition' ? 3 : 2);
          return;
        }
        if (!form.make || !form.model || !form.registrationTag)
          return setError('Fill all required fields.');
        setActiveStep(6);
        return;
      }
      case 2: {
        if (!form.existingVehicle) return setError('Select an existing vehicle.');
        if (form.compositionMode === 'newTruckExistingTrailer') setActiveStep(3);
        else setActiveStep(4);
        return;
      }
      case 3: {
        if (!form.truckMake || !form.truckModel || !form.truckRegistrationTag)
          return setError('Fill all required truck fields.');
        if (form.compositionMode === 'newComposition') setActiveStep(4);
        else setActiveStep(5);
        return;
      }
      case 4: {
        if (!form.trailerMake || !form.trailerModel || !form.trailerRegistrationTag)
          return setError('Fill all required trailer fields.');
        setActiveStep(5);
        return;
      }
      case 5: {
        submit();
        return;
      }
      default:
        return;
    }
  };

  const back = () => {
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

  /* -------- SUBMIT -------- */
  const submit = async () => {
    try {
      setLoading(true);
      setError(null);
      // Ovde ide tvoj realni API poziv
      console.log('Submitting vehicle data:', form);
      setSuccess(true);

      if (form.vehicleType === 'composition') {
        setActiveStep(6);
      } else {
        setTimeout(() => resetAll(), 1500);
      }
    } catch (e) {
      setError(e?.message || 'Submit failed.');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    activeStep,
    setActiveStep,
    pathSteps,
    currentPathIndex,
    onChange,
    next,
    back,
    resetAll,
    submit,
    availableVehicles,
    setAvailableVehicles,
    error,
    setError,
    loading,
    success
  };
}
