// models/DriverComposition.js
const { sql, getPool } = require('../util/db');

class DriverComposition {
  static async findByDriverId(driverId) {
    const pool = await getPool();
    return pool.request()
      .input('DriverID', sql.Int, driverId)
      .query(`
        SELECT DriverID, TruckID, TrailerID
        FROM DriverComposition
        WHERE DriverID = @DriverID
      `);
  }

  static async insert(driverId, truckId, trailerId, transaction) {
    return new sql.Request(transaction)
      .input('DriverID', sql.Int, driverId)
      .input('TruckID', sql.Int, truckId)
      .input('TrailerID', sql.Int, trailerId)
      .query(`
        INSERT INTO DriverComposition(DriverID, TruckID, TrailerID)
        VALUES (@DriverID, @TruckID, @TrailerID)
      `);
  }

  static async update(driverId, truckId, trailerId, transaction) {
    return new sql.Request(transaction)
      .input('DriverID', sql.Int, driverId)
      .input('TruckID', sql.Int, truckId)
      .input('TrailerID', sql.Int, trailerId)
      .query(`
        UPDATE DriverComposition
        SET TruckID = @TruckID,
            TrailerID = @TrailerID
        WHERE DriverID = @DriverID
      `);
  }

  // Upsert: ako ne postoji red za datog DriverID → INSERT; inače UPDATE
  static async upsert(driverId, truckId, trailerId, transaction) {
    return new sql.Request(transaction)
      .input('DriverID', sql.Int, driverId)
      .input('TruckID', sql.Int, truckId)
      .input('TrailerID', sql.Int, trailerId)
      .query(`
        IF EXISTS (SELECT 1 FROM DriverComposition WHERE DriverID = @DriverID)
        BEGIN
          UPDATE DriverComposition
          SET TruckID = @TruckID, TrailerID = @TrailerID
          WHERE DriverID = @DriverID;
        END
        ELSE
        BEGIN
          INSERT INTO DriverComposition(DriverID, TruckID, TrailerID)
          VALUES (@DriverID, @TruckID, @TrailerID);
        END
      `);
  }

  
  static async delete(id, transaction) {
    return new sql.Request(transaction)
      .input('DriverID', sql.Int, id)
      .query(`
        DELETE FROM DriverComposition
        WHERE DriverID = @DriverID
      `);
  }
}

module.exports = DriverComposition;
