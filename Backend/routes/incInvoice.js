const express = require('express');
const router = express.Router();

const incInvoiceController = require('../controllers/incInvoice');

// GET /incInvoice/read
router.get('/read', incInvoiceController.getReadAllIncInv);
router.get('/read/IncInvCarrier', incInvoiceController.getReadInvoiceCarrier);
router.get('/read/IncInvOther', incInvoiceController.getReadInvoiceOther);


module.exports = router;