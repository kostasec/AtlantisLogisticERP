const { sql, getPool } = require('../util/db');

class Inspection{

  static async fetchAll(){
    const pool = await getPool();
      return pool.request().query(`
        SELECT *
        FROM Inspection
        WHERE InspectionType = 'Vehicle'
        `);
    }

  static async insertTruck(truckId, inspectionId, expiryDate, transaction) {
    return new sql.Request(transaction)
      .input('TruckID', sql.Int, truckId)
      .input('InspectionID', sql.Int, inspectionId)
      .input('Date', sql.Date, expiryDate)
      .query(`
        INSERT INTO TruckInspection (TruckID, InspectionID, Date)
        VALUES (@TruckID, @InspectionID, @Date)
      `);
  }

 static async insertTrailer(trailerId, inspectionId, expiryDate, transaction) {
    return new sql.Request(transaction)
      .input('TrailerID', sql.Int, trailerId)
      .input('InspectionID', sql.Int, inspectionId)
      .input('Date', sql.Date, expiryDate)
      .query(`
        INSERT INTO TrailerInspection (TrailerID, InspectionID, Date)
        VALUES (@TrailerID, @InspectionID, @Date)
      `);
  }   
}

module.exports = Inspection;