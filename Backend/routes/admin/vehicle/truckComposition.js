const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../../../util/db');


// GET: Insert Truck with trailer options
router.get('/insert', async (req, res) => {
  try {
    const pool = await getPool();
    const trailers = await pool.request().query(`
      SELECT TrailerID, RegistrationTag
      FROM Trailer
      WHERE Status = 'Active'
    `);

    const drivers = await pool.request().query(`
      SELECT EmplID, FirstName, LastName
      FROM Employee
      WHERE EmplType='Driver'
      `);

    res.render('vehicle/insert-truckComposition', {
      pageTitle: 'Add New Truck',
      existingTrailers: trailers.recordset,
      existingDrivers: drivers.recordset
    });

  } catch (err) {
    console.error('Error loading trailer options:', err);
    res.status(500).send('Database error');
  }
});


// POST: Insert Truck with optional Trailer (existing or new)
router.post('/insert', async (req, res) => {
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

    // 2. Trailer handling
    let trailerID = null;

    if (ExistingTrailerID) {
      // Link existing trailer
      trailerID = parseInt(ExistingTrailerID);
    } else if (TrailerMake && TrailerModel && TrailerRegistrationTag) {
      // Insert new trailer
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
    }

    // 3. Composition insert (if trailer exists)
    
    if (trailerID) {
      await new sql.Request(transaction)
        .input('TruckID', sql.Int, insertedTruckID)
        .input('TrailerID', sql.Int, trailerID)
        .query(`
          INSERT INTO Composition (TruckID, TrailerID)
          VALUES (@TruckID, @TrailerID)
        `);
    }


    driverID=parseInt(DriverID);
    if (trailerID) {
      await new sql.Request(transaction)
        .input('TruckID', sql.Int, insertedTruckID)
        .input('TrailerID', sql.Int, trailerID)
        .input('DriverID', sql.Int, driverID)
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