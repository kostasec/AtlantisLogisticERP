// Sve konstante + statični opisi
export const VEHICLE_TYPES = [
  { value: 'truck', label: 'Truck' },
  { value: 'trailer', label: 'Trailer' },
  { value: 'composition', label: 'Composition' }
];

export const COMPOSITION_MODES = [
  { value: 'newTruckExistingTrailer', label: 'Add New Truck to Existing Trailer' },
  { value: 'newTrailerExistingTruck', label: 'Add New Trailer to Existing Truck' },
  { value: 'newComposition', label: 'Create New Composition' }
];

// Mock za dropdown postojećih vozila (dok ne spojiš backend)
export const MOCK = {
  trucks: [
    { value: 'truck1', label: 'Truck SU-789-EF' },
    { value: 'truck2', label: 'Truck SU-012-GH' }
  ],
  trailers: [
    { value: 'trailer1', label: 'Trailer SU-123-AB' },
    { value: 'trailer2', label: 'Trailer SU-456-CD' }
  ]
};

// Master lista koraka po apsolutnom indeksu
export const MASTER_STEPS = [
  { key: 'type', label: 'Select Vehicle Type', description: 'Choose the type of vehicle to add' },             // 0
  { key: 'modeOrInfo', label: 'Composition Mode', description: 'Depending on type, select mode or enter info' }, // 1
  { key: 'existing', label: 'Select Existing Vehicle', description: 'Select truck or trailer to pair with' },    // 2
  { key: 'newTruckInformation', label: 'New Truck Information', description: 'Enter information for the new truck' }, // 3
  { key: 'newTrailerInformation', label: 'New Trailer Information', description: 'Enter information for the new trailer' }, // 4
  { key: 'summary', label: 'Summary', description: 'Review composition and assign driver (optional)' },          // 5
  { key: 'done', label: 'Done', description: 'Process completed successfully' }                                   // 6
];
