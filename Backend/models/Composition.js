const { sql, getPool } = require('../util/db');

class Composition {

  static async fetchAll() {
  const pool = await getPool();
    return pool.request().query(`
      SELECT * FROM vw_CompositionDisplay
    `);
  }

  static async insert(truckId, trailerId, compositionId, transaction) {
    return new sql.Request(transaction)
      .input('CommpositionID', sql.Int, compositionId)
      .input('TruckID', sql.Int, truckId)
      .input('TrailerID', sql.Int, trailerId)
      .query(`
        INSERT INTO Composition
        (CompositionID, TruckID, TrailerID)
        VALUES 
        (@CompositionID, @TruckID, @TrailerID)
        SELECT SCOPE_IDENTITY() AS CompositionID;
      `);
  }

  static async delete(compositionId, transaction) {
    return new sql.Request(transaction)
      .input('CompositionID', sql.Int, compositionId)
      .query(`
        DELETE FROM Composition
        WHERE CompositionID=@CompositionID
      `);
  }

}

module.exports = Composition;