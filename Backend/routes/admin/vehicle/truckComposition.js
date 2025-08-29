const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../../../util/db');


// GET: Insert Truck
router.get('/insert', async (req, res) => {
    try {
        const pool = await getPool();
        const trailers = await pool.request().query(`
            SELECT *
            FROM Trailer
            WHERE Status = 'Active'
        `);
        const drivers = await pool.request().query(`
            SELECT EmplID, FirstName, LastName
            FROM Employee
            WHERE EmplType='Driver'
        `);
        const inspections = await pool.request().query(`
            SELECT InspectionID, Name
            FROM Inspection
            WHERE InspectionType = 'Vehicle'
        `);
        res.render('vehicle/insert-truckComposition', {
            pageTitle: 'Add New Truck',
            existingTrailers: trailers.recordset,
            existingDrivers: drivers.recordset,
            inspections: inspections.recordset
        });
    } catch (err) {
        console.error('Error loading truck options:', err);
        res.status(500).send('Database Error');
    }
});

// POST: Insert Truck with optional Trailer (existing or new)
router.post('/insert', async (req, res) => {
    console.log('POST /truckComposition/insert BODY:', req.body);
    try {
        const {
            TruckMake,
            TruckModel,
            TruckRegistrationTag,
            ExistingTrailerID,
            TrailerMake,
            TrailerModel,
            TrailerRegistrationTag,
            DriverID
        } = req.body;

        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        // 1. Insert Truck
        const truckResult = await new sql.Request(transaction)
            .input('Make', sql.VarChar, TruckMake)
            .input('Model', sql.VarChar, TruckModel)
            .input('RegistrationTag', sql.VarChar, TruckRegistrationTag)
            .input('Status', sql.VarChar, 'Active')
            .query(`
                INSERT INTO Truck (Make, Model, RegistrationTag, Status)
                VALUES (@Make, @Model, @RegistrationTag, @Status);
                SELECT SCOPE_IDENTITY() AS TruckID;
            `);

        const insertedTruckID = truckResult.recordset[0].TruckID;

        // 2. Truck Inspections
        for (const key in req.body) {
            if (key.startsWith('truckInspections_')) {
                const inspectionId = key.split('_')[1];
                const expiryDate = req.body[key];
                if (expiryDate && expiryDate.trim() !== "") {
                    await new sql.Request(transaction)
                        .input('TruckID', sql.Int, insertedTruckID)
                        .input('InspectionID', sql.Int, parseInt(inspectionId))
                        .input('Date', sql.Date, expiryDate)
                        .query(`
                            INSERT INTO TruckInspection (TruckID, InspectionID, Date)
                            VALUES (@TruckID, @InspectionID, @Date)
                        `);
                }
            }
        }

        // 3. Insert Trailer
        let trailerID = null;
        if (ExistingTrailerID) {
            trailerID = parseInt(ExistingTrailerID);
        } else if (TrailerMake && TrailerModel && TrailerRegistrationTag) {
            const trailerResult = await new sql.Request(transaction)
                .input('Make', sql.VarChar, TrailerMake)
                .input('Model', sql.VarChar, TrailerModel)
                .input('RegistrationTag', sql.VarChar, TrailerRegistrationTag)
                .input('Status', sql.VarChar, 'Active')
                .query(`
                    INSERT INTO Trailer (Make, Model, RegistrationTag, Status)
                    VALUES (@Make, @Model, @RegistrationTag, @Status);
                    SELECT SCOPE_IDENTITY() AS TrailerID;
                `);

            trailerID = trailerResult.recordset[0].TrailerID;

            // 4. Trailer Inpection
            for (const key in req.body) {
                if (key.startsWith('trailerInspections_')) {
                    const inspectionId = key.split('_')[1];
                    const expiryDate = req.body[key];
                    if (expiryDate && expiryDate.trim() !== "") {
                        await new sql.Request(transaction)
                            .input('TrailerID', sql.Int, trailerID)
                            .input('InspectionID', sql.Int, parseInt(inspectionId))
                            .input('Date', sql.Date, expiryDate)
                            .query(`
                                INSERT INTO TrailerInspection (TrailerID, InspectionID, Date)
                                VALUES (@TrailerID, @InspectionID, @Date)
                            `);
                    }
                }
            }
        }

        // 5. Insert Composition (if trailer exists)
        if (trailerID) {
            await new sql.Request(transaction)
                .input('TruckID', sql.Int, insertedTruckID)
                .input('TrailerID', sql.Int, trailerID)
                .query(`
                    INSERT INTO Composition (TruckID, TrailerID)
                    VALUES (@TruckID, @TrailerID)
                `);
        }

        // 6. Link driver to composition
        const driverIDValue = parseInt(DriverID);
        if (driverIDValue) {
            await new sql.Request(transaction)
                .input('TruckID', sql.Int, insertedTruckID)
                .input('TrailerID', sql.Int, trailerID)
                .input('DriverID', sql.Int, driverIDValue)
                .query(`
                    INSERT INTO DriverComposition(TruckID, TrailerID, DriverID)
                    VALUES (@TruckID, @TrailerID, @DriverID)
                `);
        }

        await transaction.commit();
        res.redirect('/admin/vehicle/truckComposition/insert');

    } catch (err) {
        console.error('Error inserting full truck composition:', err);
        res.status(500).send('Database error');
    }
});

module.exports = router;