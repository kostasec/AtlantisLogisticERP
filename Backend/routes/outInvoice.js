const express = require('express');
const router = express.Router();

const outInvoiceController = require('../controllers/outInvoice');

// GET /admin/outInvoice/read
router.get('/read', outInvoiceController.getReadInvoice);

// GET /admin/outInvoice/insert
router.get('/insert', outInvoiceController.getInsertInvoice);

// POST /admin/outInvoice/insert
router.post('/insert', outInvoiceController.postInsertInvoice);

module.exports = router;
