const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../../util/db');


// GET /admin/employee/read
router.get('/read', async (req, res) => {
    try {
        const pool = await getPool();
        const employees = await pool.request().query(`
            SELECT * FROM vw_EmployeeBack
            WHERE Status='Active'
        `);

        res.render('employee/read-employee', {
            pageTitle: 'All Employees',
            path: '/admin/employee/read',
            employees: employees.recordset
        });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Database Error');
    }
});


// GET /admin/employee/insert
router.get('/insert', async (req, res) => {
    try {
        const pool = await getPool();

        const managersResult = await pool.request().query(`
           SELECT EmplID, FirstName, LastName 
           FROM Employee 
           WHERE EmplType LIKE '%Director%' AND Status = 'Active';
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
        //
        const mgrIdValue = req.body.MgrID && typeof req.body.MgrID === 'string' && req.body.MgrID.trim() !== '' ? req.body.MgrID.trim() : null;
        const compositionValue = req.body.Composition && typeof req.body.Composition === 'string' && req.body.Composition.trim() !== '' ? req.body.Composition.trim() : null;

        let truckIdValue = null;
        let trailerIdValue = null;

        if (compositionValue) {
        const [truckId, trailerId] = compositionValue.split(',');
        truckIdValue = truckId && truckId.trim() !== '' ? truckId.trim() : null;
        trailerIdValue = trailerId && trailerId.trim() !== '' ? trailerId.trim() : null;
        }
        // zbog primarnog kljuca koji skup dva strana kljuca u bazi - za dalje bolje da izbegavam ovaj pristup i stavljam samo primarni kljuc koji nije skup vise kljuceva
        
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        const employeeResult = await new sql.Request(transaction)
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
                SELECT SCOPE_IDENTITY() AS EmplID;
            `);

        const insertedEmployeeID = employeeResult.recordset[0].EmplID;
        
        if(insertedEmployeeID){
            await new sql.Request(transaction)
            .input('DriverID', sql.Int, insertedEmployeeID)
            .input('TruckID', sql.Int, truckIdValue)
            .input('TrailerID', sql.Int, trailerIdValue)
            .query(`
                INSERT INTO DriverComposition(DriverID, TruckID, TrailerID)
                VALUES (@DriverID, @TruckID, @TrailerID)
            `);
        }
        
        await transaction.commit();
        console.log('Employee inserted successfully.');
        res.redirect('/admin/employee/insert');

    } catch (err) {
        if (transaction) await transaction.rollback();
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
        .query(`SELECT EmplID, FirstName, LastName 
            FROM Employee 
            WHERE EmplType LIKE '%Director%' AND Status = 'Active'`)

        const compositionsResult = await pool.request().query(`
            SELECT * FROM vw_CompositionDisplay
        `);

        res.render('employee/update-employee', {
            employee: employeeResult.recordset[0],
            managers: managersResult.recordset,
            compositions: compositionsResult.recordset
        });
    } catch (err){
        console.error('Error updating employees:', err);
        res.status(500).send('Database error');
    }
});


// POST /admin/employee/update/:id
router.post('/update/:id', async (req, res) => {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const mgrIdValue = req.body.MgrID && typeof req.body.MgrID === 'string' && req.body.MgrID.trim() !== '' ? req.body.MgrID.trim() : null;
        const compositionValue = req.body.Composition && req.body.Composition.trim() !== '' 
            ? req.body.Composition.trim() 
            : null;

        let truckIdValue = null;
        let trailerIdValue = null;

        if (compositionValue) {
            const [truckId, trailerId] = compositionValue.split(',');
            truckIdValue = truckId && truckId.trim() !== '' ? truckId.trim() : null;
            trailerIdValue = trailerId && trailerId.trim() !== '' ? trailerId.trim() : null;
        }

        // 1. Update Employee
        await new sql.Request(transaction)
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
            .input('MgrID', sql.VarChar, mgrIdValue)
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

        // 2. Update DriverComposition
        await new sql.Request(transaction)
            .input('EmplID', sql.Int, req.params.id)
            .input('TruckID', sql.Int, truckIdValue)
            .input('TrailerID', sql.Int, trailerIdValue)
            .query(`
                UPDATE DriverComposition SET
                    TruckID = @TruckID,
                    TrailerID = @TrailerID
                WHERE DriverID = @EmplID
            `);

        await transaction.commit();
        console.log('Employee updated successfully.');
        res.redirect('/admin/employee/read');
    } catch (err) {
        if (transaction._aborted !== true) {
            await transaction.rollback();
        }
        console.error('Error database updating:', err);
        res.status(500).send('Database error');
    }
});


// POST /admin/employee/delete/:id
router.post('/delete/:id', async (req, res) => {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        await new sql.Request(transaction)
            .input('EmplID', sql.Int, req.params.id)
            .query(`UPDATE Employee SET Status = 'Inactive' WHERE EmplID = @EmplID`);
        
            await new sql.Request(transaction)
            .input('EmplID', sql.Int, req.params.id)
            .query(`DELETE FROM DriverComposition WHERE DriverID = @EmplID`);

            await transaction.commit();
            console.log('Employee deleted successfully.');
            res.redirect('/admin/employee/read');
    } catch (err) {
        if (transaction._aborted !== true) {
            await transaction.rollback();
        }
        console.error('Error database updating:', err);
        res.status(500).send('Database error');
    }
});



module.exports = router;