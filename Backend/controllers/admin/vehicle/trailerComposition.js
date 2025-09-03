const { sql, getPool } = require('../../../util/db');

exports.getInsertTrailer = async (req, res, next) => {
    try{
        const pool = await getPool();
        const trucks = await pool.request().query(`
            SELECT * 
            FROM Truck
            WHERE Status='Active'
            `);
        const drivers = await pool.request().query(`
            SELECT EmplID, FirstName, LastName
            FROM Employee
            WHERE EmplType='Driver'
            `);
        const inspections = await pool.request().query(`
            SELECT InspectionID, Name
            FROM Inspection
            WHERE InspectionType='Vehicle'
            `);
        res.render('vehicle/insert-trailerComposition', {
            pageTitle: 'Add new Trailer',
            existingTucks: trucks.recordset,
            existingDrivers: drivers.recordset,
            inspections: inspections.recordset
        })
    } catch (err) {
        console.error('Error loading trailer options: ', err);
        res.status(500).send('Database Error')
    }
};

exports.postInsertTrailer = async (req, res, next) => {
     console.log('POST /trailerComposition/insert BODY:', req.body);
    try{
        const{
            TrailerMake,
            TrailerModel,
            TrailerRegistrationTag,
            ExistingTruckID,
            TruckMake,
            TruckModel,
            TruckRegistrationTag,
            DriverID
        }= req.body;

        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        //1. Insert Trailer
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

        const insertedTrailerID = trailerResult.recordset[0].TrailerID;

        // 2. Trailer Inspection
        for(const key in req.body){
            if (key.startsWith('trailerInspections_')){
                const inspectionId = key.split('_')[1];
                const expiryDate = req.body[key];
                if(expiryDate && expiryDate.trim() !==""){
                    await new sql.Request(transaction)
                    .input('TrailerID', sql.Int, insertedTrailerID)
                    .input('InspectionID', sql.Int, parseInt(inspectionId))
                    .input('Date', sql.Date, expiryDate)
                    .query(`
                        INSERT INTO TrailerInspection (TrailerID, InspectionID, Date)
                        VALUES (@TrailerID, @InspectionID, @Date)
                    `);

                }

            }
        }

        //3. Insert Truck
        let truckID = null;
        if(ExistingTruckID){
            truckID=parseInt(ExistingTruckID);
        } else if (TruckMake && TruckModel && TruckRegistrationTag){
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

            truckID = truckResult.recordset[0].TruckID;
            
            //4. Truck Inspection
            for(const key in req.body){
                if(key.startsWith('truckInspections_')){
                    const inspectionId = key.split('_')[1];
                    const expiryDate= req.body[key];
                    if(expiryDate && expiryDate.trim() !== ""){
                        await new sql.Request(transaction)
                        .input('TruckID', sql.Int, truckID)
                        .input('InspectionID', sql.Int, parseInt(inspectionId))
                        .input('Date', sql.Date, expiryDate)
                        .query(`
                                INSERT INTO TruckInspection (TruckID, InspectionID, Date)
                                VALUES (@TruckID, @InspectionID, @Date)
                            `);
                    }

                }
            }

        }

        //5.  Insert Composition (if truck exists)
        if(truckID){
            await new sql.Request(transaction)
            .input('TruckID', sql.Int, truckID)
            .input('TrailerID', sql.Int, insertedTrailerID)
            .query(`
                INSERT INTO Composition (TruckID, TrailerID)
                VALUES (@TruckID, @TrailerID)
                `);
        }

        //6. Link driver to composition
        const driverIDValue = parseInt(DriverID);
        if (driverIDValue) {
            await new sql.Request(transaction)
                .input('TruckID', sql.Int, truckID)
                .input('TrailerID', sql.Int, insertedTrailerID)
                .input('DriverID', sql.Int, driverIDValue)
                .query(`
                    INSERT INTO DriverComposition(TruckID, TrailerID, DriverID)
                    VALUES (@TruckID, @TrailerID, @DriverID)
                `);
        }

        await transaction.commit();
        res.redirect('/admin/vehicle/trailerComposition/insert');
        
            

    } catch (err) {
        console.error('Error inserting full truck composition:', err);
        res.status(500).send('Database error');
    }

};