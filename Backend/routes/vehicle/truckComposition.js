const express = require('express');
const router = express.Router();

const truckCompositionController = require('../../controllers/vehicle/truckComposition');


// GET: Insert Truck
router.get('/insert', truckCompositionController.getInsertTruck);

// POST: Insert Truck with optional Trailer (existing or new)
router.post('/insert', truckCompositionController.postInsertTruck);

module.exports = router;