const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client');


// GET /client/read
router.get('/read', clientController.getReadClient);

// POST /client/upsert
router.post('/upsert', clientController.postUpsertClient);

// GET /client/insert
router.get('/insert', clientController.getInsertClient);

// GET /client/update/:taxId
router.get('/update/:taxId', clientController.getUpdateClient);

// POST /client/delete/:id
router.post('/delete/:id', clientController.postDeleteClient);

// POST /client/contact/delete/:id
router.post('/contact/delete/:id', clientController.postDeleteClientContact);

// API endpoint za frontend
router.get('/api', clientController.getClientsAPI);

module.exports = router;