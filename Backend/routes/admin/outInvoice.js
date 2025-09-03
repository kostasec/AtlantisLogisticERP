const path = require('path');
const express = require('express');
const router = express.Router();

const outInvoiceController = require('../../controllers/admin/outInvoice')


// GET /admin/outInvoice/read
router.get('/read', outInvoiceController.getReadInvoice);

// GET /admin/outInvoice/insert
router.get('/insert', outInvoiceController.getInsertInvocie);

// POST /admin/outInvoice/insert
router.post('/insert', outInvoiceController.poistInsertInvoice);


module.exports = router;