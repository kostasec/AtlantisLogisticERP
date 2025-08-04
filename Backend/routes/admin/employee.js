
const express = require('express');
const router = express.Router();
const { sql, config } = require('../../util/db');

// POST /admin/employee/delete/:id
router.post('/delete/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('EmplID', sql.Int, req.params.id)
            .query("UPDATE Employee SET Status = 'Inactive' WHERE EmplID = @EmplID");
        res.redirect('/admin/employee/all');
    } catch (err) {
        console.error('Greška pri "brisanje" zaposlenog (Status=Inactive):', err);
        res.status(500).send('Greška u bazi');
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
        res.redirect('/admin/employee/all');
    } catch (err) {
        console.error('Greška pri ažuriranju zaposlenog:', err);
        res.status(500).send('Greška u bazi');
    }
});

// GET /admin/employee/edit/:id
router.get('/edit/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request()
            .input('EmplID', sql.Int, req.params.id)
            .query('SELECT * FROM Employee WHERE EmplID = @EmplID');
        if (result.recordset.length === 0) {
            return res.status(404).send('Zaposleni nije pronađen.');
        }
        res.render('employee/edit-employee', {
            employee: result.recordset[0]
        });
    } catch (err) {
        console.error('Greška pri dohvatanju zaposlenog za izmenu:', err);
        res.status(500).send('Greška u bazi');
    }
});

// GET /admin/employee/test-connection
router.get('/test-connection', async (req, res) => {
    try {
        await sql.connect(config);
        res.send('Database connection successful!');
    } catch (err) {
        res.status(500).send('Error:' + err.message);
    }
});

// GET /admin/employee/add
router.get('/add',(req, res, next)=> {
    res.render('employee/add-employee',{
        pageTitle: 'Add Employee',
        path: '/admin/employee/add'
    });
});


// POST /admin/employee/add
router.post('/add', async (req, res, next) => {
    try {
        console.log('Attempting to add employee...');
        let pool = await sql.connect(config);
        console.log('Database connection successful.');
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
            .input('MgrID', sql.VarChar, req.body.MgrID)
            .query(`
                INSERT INTO Employee 
                (EmplType, FirstName, LastName, StreetAndNmbr, City, ZIPCode, Country, PhoneNmbr, EmailAddress, IDCardNmbr, PassportNmbr, MgrID)
                VALUES 
                (@EmplType, @FirstName, @LastName, @StreetAndNmbr, @City, @ZIPCode, @Country, @PhoneNmbr, @EmailAddress, @IDCardNmbr, @PassportNmbr, @MgrID)
            `);
        console.log('Employee inserted successfully.');
        res.redirect('/admin/employee/add');
    } catch (err) {
        console.error('Error during database operation:', err);
        res.status(500).send('Database error');
    }
});

// GET /admin/employee/all
router.get('/all', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM Employee WHERE Status = 'Active'");
        res.render('employee/all-employees', {
            pageTitle: 'All Employees',
            path: '/admin/employee/all',
            employees: result.recordset
        });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Database error');
    }
});



// PUT /admin/employee/update/:id
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
        res.status(200).send('Zaposleni uspešno ažuriran.');
    } catch (err) {
        console.error('Greška pri ažuriranju zaposlenog:', err);
        res.status(500).send('Greška u bazi');
    }
});

module.exports = router;
