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
                v.VehicleID, 
                v.VehicleType, 
                v.Make, 
                v.Model, 
                v.RegistrationTag, 
                COALESCE(e.FirstName + ' ' + e.LastName, 'N/A') AS [DriverName]
            FROM Vehicle v
            LEFT JOIN Employee e ON v.EmplID = e.EmplID
            WHERE v.Status = 'Active'
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
router.get('/insert', async (req, res, next) => {
    try {
        let pool = await sql.connect(config);
        const driversResult = await pool.request().query(`
            SELECT EmplID, FirstName, LastName FROM Employee WHERE Status = 'Active'
        `);
        res.render('vehicle/insert-vehicle', {
            pageTitle: 'Add Vehicle',
            path: '/admin/vehicle/insert',
            drivers: driversResult.recordset
        });
    } catch (err) {
        console.error('Error fetching managers:', err);
        res.status(500).send('Database error');
    }
});

// POST /admin/vehicle/insert
router.post('/insert', async (req, res, next) => {
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



//GET /admin/vehicle/update/:id
router.get('/update/:id', async(req, res)=>{
    try{
        let pool = await sql.connect(config);
        
        // Fetch vehicle data
        const vehicleResult = await pool.request()
            .input('VehicleID', sql.Int, req.params.id)
            .query('SELECT * FROM Vehicle WHERE VehicleID = @VehicleID');
        
        if(vehicleResult.recordset.length===0){
            return res.status(404).send('Vehicle is not found.');
        }

        // Fetch drivers
        const driversResult = await pool.request()
            .query("SELECT EmplID, FirstName, LastName FROM Employee WHERE EmplType = 'Driver' AND Status = 'Active'");

        res.render('vehicle/update-vehicle',{
            vehicle: vehicleResult.recordset[0],
            drivers: driversResult.recordset
        });
    } catch(err){
        console.error('Error fetching data for vehicle update:', err);
        res.status(500).send('Database error');
    }
});

// POST /admin/vehicle/update/:id
router.post('/update/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('VehicleID', sql.Int, req.params.id)
            .input('VehicleType', sql.VarChar, req.body.VehicleType)
            .input('Make', sql.VarChar, req.body.Make)
            .input('Model', sql.VarChar, req.body.Model)
            .input('RegistrationTag', sql.VarChar, req.body.RegistrationTag)
            .input('EmplID', sql.Int, req.body.EmplID)
            .query(`
                UPDATE Vehicle SET
                    VehicleType = @VehicleType,
                    Make = @Make,
                    Model = @Model,
                    RegistrationTag = @RegistrationTag,
                    EmplID = @EmplID
                WHERE VehicleID = @VehicleID
            `);
        res.redirect('/admin/vehicle/read');
    } catch (err) {
        console.error('Error database updating:', err);
        res.status(500).send('Database error');
    }
});

// PUT /admin/vehicle/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('VehicleID', sql.Int, req.params.id)
            .input('VehicleType', sql.VarChar, req.body.VehicleType)
            .input('Make', sql.VarChar, req.body.Make)
            .input('Model', sql.VarChar, req.body.Model)
            .input('RegistrationTag', sql.VarChar, req.body.RegistrationTag)
            .input('EmplID', sql.Int, req.body.EmplID)
            .query(`
                UPDATE Vehicle SET
                    VehicleType = @VehicleType,
                    Make = @Make,
                    Model = @Model,
                    RegistrationTag = @RegistrationTag,
                    EmplID = @EmplID
                WHERE VehicleID = @VehicleID
            `);
        res.status(200).send('Vehicle updated successfullyy.');
    } catch (err) {
        console.error('Error updating vehicle:', err);
        res.status(500).send('Database error');
    }
});


//POST /admin/vehicle/delete/:id
router.post('/delete/:id', async(req,res)=>{
    try{
        let pool = await sql.connect(config);
        await pool.request()
        .input('VehicleID', sql.Int, req.params.id)
        .query("UPDATE Vehicle SET Status ='Inactive' WHERE VehicleID=@VehicleID")
        res.redirect('/admin/vehicle/read');
    } catch (err) {
        console.error('Error deleting vehicle', err);
        res.status(500).send('Database error')
    }
})





module.exports = router;
