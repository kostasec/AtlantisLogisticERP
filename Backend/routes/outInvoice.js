const express = require('express');
const router = express.Router();

const outInvoiceController = require('../controllers/outInvoice');

// GET /outInvoice/read
router.get('/read', outInvoiceController.getReadInvoice);

// GET /outInvoice/insert
router.get('/insert', outInvoiceController.getInsertInvoice);

// POST /outInvoice/insert
router.post('/insert', outInvoiceController.postInsertInvoice);

module.exports = router;
