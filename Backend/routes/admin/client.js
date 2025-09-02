const path = require('path');
const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../../util/db');
const clientController = require('../../controllers/admin/client');


// GET /admin/client/read
router.get('/read', clientController.getReadClient);

// POST /admin/client/upsert
router.post('/upsert', clientController.postUpsertClient);

// GET /admin/client/insert
router.get('/insert', clientController.getInsertClient);

// GET /admin/client/update/:taxId
router.get('/update/:taxId', clientController.getUpdateClient);

// POST /admin/client/delete/:id
router.post('/delete/:id', clientController.postDeleteClient);

// POST /admin/client/contact/delete/:id
router.post('/contact/delete/:id', clientController.postDeleteClientContact);


module.exports = router;