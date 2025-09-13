const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../util/db');
const employeeController = require('../controllers/employee');


// GET /employee/read
router.get('/read', employeeController.getReadEmployee);

// GET /employee/insert
router.get('/insert', employeeController.getInsertEmployee);

// POST /employee/insert
router.post('/insert', employeeController.postInsertEmployee);

// GET /employee/update/:id
router.get('/update/:id', employeeController.getUpdateEmployee);

// POST /employee/update/:id
router.post('/update/:id', employeeController.postUpdateEmployee);

// POST /employee/delete/:id
router.post('/delete/:id', employeeController.postDeleteEmployee);


module.exports = router;
