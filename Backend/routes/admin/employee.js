const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../../util/db');


// GET /admin/employee/read
router.get('/read', async (req, res) => {
    try {
        const pool = await getPool();
        const driversResult = await pool.request().query(`
            SELECT e.EmplType, e.FirstName, e.LastName, e.StreetAndNmbr, e.City, e.Country, e.PhoneNmbr, e.EmailAddress, e.IDCardNmbr, e.PassportNmbr,m.FirstName+' '+m.LastName AS 'Manager', c.Composition AS 'Vehicle'
            FROM Employee e 
            LEFT JOIN vw_DriverCompositionDisplay c on (e.EmplID=c.DriverID)
            LEFT JOIN Employee m on (m.EmplID=e.MgrID)
            WHERE e.EmplType='Driver'
        `);

        const nondriversResult = await pool.request().query(`
            SELECT e.EmplType, e.FirstName, e.LastName, e.StreetAndNmbr, e.City, e.Country, e.PhoneNmbr, e.EmailAddress, e.IDCardNmbr, e.PassportNmbr,m.FirstName+' '+m.LastName AS 'Manager', v.RegistrationTag AS 'Vehicle'
            FROM Employee e
            LEFT JOIN EmployeeCar ec ON (e.EmplID=ec.EmplID)
            LEFT JOIN Vehicle v ON (v.VehicleID=ec.CarID)
            LEFT JOIN Employee m ON (m.EmplID=e.MgrID)
            WHERE e.EmplType NOT IN ('Driver')
            `);

        const allEmployees = [...driversResult.recordset, ...nondriversResult.recordset];
        res.render('employee/read-employee', {
            pageTitle: 'All Employees',
            path: '/admin/employee/read',
            employees: allEmployees
        });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Database Error');
    }
});


// GET /admin/employee/insert
router.get('/insert', async (req, res, next) => {
    try {
        const pool = await getPool();

        const managersResult = await pool.request().query(`
           SELECT EmplID, FirstName, LastName FROM Employee WHERE EmplType LIKE '%Director%' AND Status = 'Active';
        `);
        
        const compositionsResult = await pool.request().query(`
            SELECT * FROM vw_CompositionDisplay
        `);
        

        res.render('employee/insert-employee', {
            pageTitle: 'Add Employee',
            path: '/admin/employee/insert',
            managers: managersResult.recordset,
            compositions: compositionsResult.recordset
        });

    } catch (err) {
        console.error('Error fetching managers:', err);
        res.status(500).send('Database error');
    }
});


// POST /admin/employee/insert
router.post('/insert', async (req, res, next) => {
    try {
        const pool = await getPool();
        const mgrIdValue = req.body.MgrID && typeof req.body.MgrID === 'string' && req.body.MgrID.trim() !== '' ? req.body.MgrID.trim() : null;
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
        const pool = await getPool();

        //Fetch employee data
        const employeeResult = await pool.request()
            .input('EmplID', sql.Int, req.params.id)
            .query('SELECT * FROM Employee WHERE EmplID = @EmplID');

        if (employeeResult.recordset.length === 0) {
            return res.status(404).send('Employee is not found.');
        }

        //Fetch managers data
        const managersResult = await pool.request()
        .query(`SELECT EmplID, FirstName, LastName FROM Employee WHERE EmplType LIKE '%Director%' AND Status = 'Active'`)

        res.render('employee/update-employee', {
            employee: employeeResult.recordset[0],
            managers: managersResult.recordset
        });
    } catch (err){
        console.error('Error updating employees:', err);
        res.status(500).send('Database error');
    }
});


// POST /admin/employee/update/:id
router.post('/update/:id', async (req, res) => {
    try {
        const pool = await getPool();
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
        const pool = await getPool();
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
        const pool = await getPool();
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