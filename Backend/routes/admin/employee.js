const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../../util/db');
const employeeController = require('../../controllers/admin/employee');


// GET /admin/employee/read
router.get('/read', employeeController.getReadEmployee);

// GET /admin/employee/insert
router.get('/insert', employeeController.getInsertEmployee);

// POST /admin/employee/insert
router.post('/insert', employeeController.postInsertEmployee);

// GET /admin/employee/update/:id
router.get('/update/:id', employeeController.getUpdateEmployee);

// POST /admin/employee/update/:id
router.post('/update/:id', employeeController.postUpdateEmployee);

// POST /admin/employee/delete/:id
router.post('/delete/:id', employeeController.postDeleteEmployee);


module.exports = router;
