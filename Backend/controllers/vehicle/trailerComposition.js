const { sql, getPool } = require('../../util/db');
const Truck = require('../../models/Truck');
const Trailer = require('../../models/Trailer');
const Composition = require('../../models/Composition');
const DriverComposition = require('../../models/DriverComposition');
const Employee  = require('../../models/Employee');
const VehicleInspection = require('../../models/VehicleInspection');

exports.getInsertTrailer = async (req, res, next) => {
    try {
        const trucks = await Truck.fetchAll();
        const drivers = await Employee.fetchDrivers();
        const inspections = await VehicleInspection.fetchAll();
        res.render('vehicle/insert-trailerComposition', {
            pageTitle: 'Add New Truck',
            existingTrucks: trucks.recordset,
            existingDrivers: drivers.recordset,
            inspections: inspections.recordset
        });

    } catch (err) {
        console.error('Error loading truck options:', err);
        res.status(500).send('Database Error');
    }
};

exports.postInsertTrailer = async(req, res, next)=>{
    console.log('POST /truckComposition/insert BODY:', req.body);
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        const {ExistingTruckID, DriverID} = req.body;

        await transaction.begin();

        //1. Insert Trailer
        const trailerID = await Trailer.insert(req.body, transaction);

        //2. Insert Trailer Inspections
        for(const key in req.body){
            if (key.startsWith('trailerInspections_')) {
                const inspectionId = parseInt(key.split('_')[1], 10);
                const expiryDate = req.body[key];
                if (expiryDate && expiryDate.trim() !== "") {
                  await VehicleInspection.insertTrailer(
                    trailerID,
                    inspectionId,
                    expiryDate,
                    transaction
                    );
                }
            }
        }

       //3. Insert Truck
       let truckID = null;
       if(ExistingTruckID){
        truckID = parseInt(ExistingTruckID);
       } else if (req.body.TruckMake && req.body.TruckModel && req.body.TruckRegistrationTag){
            truckID = await Truck.insert(req.body, transaction);
       }

       //4. Insert Truck Inspections
       for (const key in req.body) {
            if (key.startsWith('truckInspections_')) {
                const inspectionId = parseInt(key.split('_')[1], 10);
                const expiryDate = req.body[key];
                if (expiryDate && expiryDate.trim() !== "") {
                  await VehicleInspection.insertTruck(
                    truckID,
                    inspectionId,
                    expiryDate,
                    transaction
                    );
                }
            }
        }

        //5. Insert Composition
        if(truckID){
            await Composition.insert(truckID, trailerID, transaction)
        }

        //6. Link driver to composition
        const driverIDValue = parseInt(DriverID);
        if(driverIDValue){
            await DriverComposition.insert(driverIDValue, truckID, trailerID, transaction)
        }

        await transaction.commit();
        res.redirect('/vehicle/trailerComposition/insert');
       
    } catch (err) {
        console.error('Error inserting full truck composition:', err);
        res.status(500).send('Database error');
    }

}