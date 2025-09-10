const express = require('express');
const router = express.Router();

const trailerCompositionController = require('../../controllers/vehicle/trailerComposition');

//GET: Insert Trailer
router.get('/insert', trailerCompositionController.getInsertTrailer);

// POST: Insert Trailer with optional Truck (existing or new)
router.post('/insert',trailerCompositionController.postInsertTrailer);

module.exports = router;
