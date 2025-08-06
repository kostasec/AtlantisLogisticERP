const express = require('express');
const router = express.Router();
const { sql, config } = require('../../util/db');


// GET /admin/employee/test-connection
router.get('/test-connection', async (req, res) => {
    try {
        await sql.connect(config);
        res.send('Database connection successful!');
    } catch (err) {
        res.status(500).send('Error:' + err.message);
    }
});


// GET /admin/employee/read
router.get('/read', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT e.*, m.FirstName+' '+m.LastName AS ManagerName
            FROM Employee e
            LEFT JOIN Employee m ON e.MgrID = m.EmplID
            WHERE e.Status = 'Active'
        `);
        res.render('employee/read-employee', {
            pageTitle: 'All Employees',
            path: '/admin/employee/read',
            employees: result.recordset
        });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Database Error');
    }
});


// GET /admin/employee/insert
router.get('/insert', async (req, res, next) => {
    try {
        let pool = await sql.connect(config);
        const managersResult = await pool.request().query(`
            SELECT EmplID, FirstName, LastName FROM Employee WHERE EmplType = 'Director' AND Status = 'Active'
        `);
        res.render('employee/insert-employee', {
            pageTitle: 'Add Employee',
            path: '/admin/employee/insert',
            managers: managersResult.recordset
        });
    } catch (err) {
        console.error('Error fetching managers:', err);
        res.status(500).send('Database error');
    }
});

// POST /admin/employee/insert
router.post('/insert', async (req, res, next) => {
    try {
        console.log('Attempting to add employee...');
        let pool = await sql.connect(config);
        console.log('Database connection successful.');
        const mgrIdValue = req.body.MgrID && req.body.MgrID.trim() !== '' ? req.body.MgrID : null;
        await pool.request()
            .input('EmplType', sql.VarChar, req.body.EmplType)
            .input('FirstName', sql.VarChar, req.body.FirstName)
            .input('LastName', sql.VarChar, req.body.LastName)
            .input('StreetAndNmbr', sql.VarChar, req.body.StreetAndNmbr)
            .input('City', sql.VarChar, req.body.City)
            .input('ZIPCode', sql.VarChar, req.body.ZIPCode)
            .input('Country', sql.VarChar, req.body.Country)
            .input('PhoneNmbr', sql.VarChar, req.body.PhoneNmbr)
            .input('EmailAddress', sql.VarChar, req.body.EmailAddress)
            .input('IDCardNmbr', sql.VarChar, req.body.IDCardNmbr)
            .input('PassportNmbr', sql.VarChar, req.body.PassportNmbr)
            .input('MgrID', sql.VarChar, mgrIdValue)
            .query(`
                INSERT INTO Employee 
                (EmplType, FirstName, LastName, StreetAndNmbr, City, ZIPCode, Country, PhoneNmbr, EmailAddress, IDCardNmbr, PassportNmbr, MgrID)
                VALUES 
                (@EmplType, @FirstName, @LastName, @StreetAndNmbr, @City, @ZIPCode, @Country, @PhoneNmbr, @EmailAddress, @IDCardNmbr, @PassportNmbr, @MgrID)
            `);


        console.log('Employee inserted successfully.');
        res.redirect('/admin/employee/insert');
    } catch (err) {
        console.error('Error inserting employee into database.', err);
        res.status(500).send('Database error');
    }
});


// GET /admin/employee/update/:id
router.get('/update/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request()
            .input('EmplID', sql.Int, req.params.id)
            .query('SELECT * FROM Employee WHERE EmplID = @EmplID');
        if (result.recordset.length === 0) {
            return res.status(404).send('Employee is not found.');
        }
        res.render('employee/update-employee', {
            employee: result.recordset[0]
        });
    } catch (err) {
        console.error('Error updating employees:', err);
        res.status(500).send('Database error');
    }
});

// POST /admin/employee/update/:id
router.post('/update/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('EmplID', sql.Int, req.params.id)
            .input('EmplType', sql.VarChar, req.body.EmplType)
            .input('FirstName', sql.VarChar, req.body.FirstName)
            .input('LastName', sql.VarChar, req.body.LastName)
            .input('StreetAndNmbr', sql.VarChar, req.body.StreetAndNmbr)
            .input('City', sql.VarChar, req.body.City)
            .input('ZIPCode', sql.VarChar, req.body.ZIPCode)
            .input('Country', sql.VarChar, req.body.Country)
            .input('PhoneNmbr', sql.VarChar, req.body.PhoneNmbr)
            .input('EmailAddress', sql.VarChar, req.body.EmailAddress)
            .input('IDCardNmbr', sql.VarChar, req.body.IDCardNmbr)
            .input('PassportNmbr', sql.VarChar, req.body.PassportNmbr)
            .input('MgrID', sql.VarChar, req.body.MgrID)
            .query(`
                UPDATE Employee SET
                    EmplType = @EmplType,
                    FirstName = @FirstName,
                    LastName = @LastName,
                    StreetAndNmbr = @StreetAndNmbr,
                    City = @City,
                    ZIPCode = @ZIPCode,
                    Country = @Country,
                    PhoneNmbr = @PhoneNmbr,
                    EmailAddress = @EmailAddress,
                    IDCardNmbr = @IDCardNmbr,
                    PassportNmbr = @PassportNmbr,
                    MgrID = @MgrID
                WHERE EmplID = @EmplID
            `);
        res.redirect('/admin/employee/read');
    } catch (err) {
        console.error('Error database updating:', err);
        res.status(500).send('Database error');
    }
});

// PUT /admin/employee/update/:id
//za sada mi ne treba .put jer sve ide preko .post ali kad dodje React frontedn on ce koristiti .put
router.put('/update/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('EmplID', sql.Int, req.params.id)
            .input('EmplType', sql.VarChar, req.body.EmplType)
            .input('FirstName', sql.VarChar, req.body.FirstName)
            .input('LastName', sql.VarChar, req.body.LastName)
            .input('StreetAndNmbr', sql.VarChar, req.body.StreetAndNmbr)
            .input('City', sql.VarChar, req.body.City)
            .input('ZIPCode', sql.VarChar, req.body.ZIPCode)
            .input('Country', sql.VarChar, req.body.Country)
            .input('PhoneNmbr', sql.VarChar, req.body.PhoneNmbr)
            .input('EmailAddress', sql.VarChar, req.body.EmailAddress)
            .input('IDCardNmbr', sql.VarChar, req.body.IDCardNmbr)
            .input('PassportNmbr', sql.VarChar, req.body.PassportNmbr)
            .input('MgrID', sql.VarChar, req.body.MgrID)
            .query(`
                UPDATE Employee SET
                    EmplType = @EmplType,
                    FirstName = @FirstName,
                    LastName = @LastName,
                    StreetAndNmbr = @StreetAndNmbr,
                    City = @City,
                    ZIPCode = @ZIPCode,
                    Country = @Country,
                    PhoneNmbr = @PhoneNmbr,
                    EmailAddress = @EmailAddress,
                    IDCardNmbr = @IDCardNmbr,
                    PassportNmbr = @PassportNmbr,
                    MgrID = @MgrID
                WHERE EmplID = @EmplID
            `);
        res.status(200).send('Employee updated successfullyy.');
    } catch (err) {
        console.error('Error updating employees:', err);
        res.status(500).send('Database error');
    }
});


// POST /admin/employee/delete/:id
router.post('/delete/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('EmplID', sql.Int, req.params.id)
            .query("UPDATE Employee SET Status = 'Inactive' WHERE EmplID = @EmplID");
        res.redirect('/admin/employee/read');
    } catch (err) {
        console.error('Error deleting employee', err);
        res.status(500).send('Database error');
    }
});



module.exports = router;
