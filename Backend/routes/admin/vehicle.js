const express = require('express');
const router = express.Router();
const { sql, config } = require('../../util/db');

// GET /admin/vehicle/test-connection
router.get('/test-connection', async (req, res) => {
    try {
        await sql.connect(config);
        res.send('Database connection successful!');
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

// GET /admin/vehicle/read
router.get('/read', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT 
                vehicle.VehicleType, 
                vehicle.Make, 
                vehicle.Model, 
                vehicle.RegistrationTag, 
                employee.FirstName+' '+employee.LastName AS [DriverName]
            FROM Vehicle vehicle
            LEFT JOIN Employee employee ON vehicle.EmplID = employee.EmplID
            WHERE vehicle.Status = 'Active'
        `);


        res.render('vehicle/read-vehicles', {
            pageTitle: 'All Vehicles',
            path: '/admin/vehicle/read',
            vehicles: result.recordset
        });
    } catch (err) {
        console.error('Error fetching vehicles: ', err);
        res.status(500).send('Database Error');
    }
    
});


// GET /admin/vehicle/insert
router.get('/insert', (req, res) => {
    res.render('vehicle/insert-vehicle', {
        pageTitle: 'Add Vehicle',
        path: '/admin/vehicle/insert'
    });
});

// POST /admin/vehicle/insert
router.post('/insert', async (req, res) => {
    try {
        console.log('Attempting to add vehicle...');
        let pool = await sql.connect(config);
        console.log('Database connection successful.');

        const emplIdValue = req.body.EmplID && req.body.EmplID.trim() !== '' ? req.body.EmplID : null;

        await pool.request()
            .input('VehicleType', sql.VarChar, req.body.VehicleType)
            .input('Make', sql.VarChar, req.body.Make)
            .input('Model', sql.VarChar, req.body.Model)
            .input('RegistrationTag', sql.VarChar, req.body.RegistrationTag)
            .input('EmplID', sql.Int, emplIdValue)
            .query(`
                INSERT INTO Vehicle
                (VehicleType, Make, Model, RegistrationTag, EmplID)
                VALUES
                (@VehicleType, @Make, @Model, @RegistrationTag, @EmplID)
            `);

        console.log('Vehicle inserted successfully');
        res.redirect('/admin/vehicle/insert');
    } catch (err) {
        console.error('Error inserting vehicle into database:', err);
        res.status(500).send('Database Error');
    }
});

module.exports = router;
