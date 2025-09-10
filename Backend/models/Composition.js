const { sql, getPool } = require('../util/db');

class Composition {
  static async insert(truckId, trailerId, transaction) {
    return new sql.Request(transaction)
      .input('TruckID', sql.Int, truckId)
      .input('TrailerID', sql.Int, trailerId)
      .query(`
        INSERT INTO Composition(TruckID, TrailerID)
        VALUES (@TruckID, @TrailerID)
      `);
  }


  static async delete(truckId, trailerId, transaction) {
    return new sql.Request(transaction)
      .input('TruckID', sql.Int, truckId)
      .input('TrailerID', sql.Int, trailerId)
      .query(`
        UPDATE Composition
        SET Status='Inactive'
        WHERE TruckID=@TruckID AND TrailerID=@TrailerID
      `);
  }

  static async fetchAll() {
    const pool = await getPool();
    return pool.request().query(`
      SELECT * FROM vw_CompositionDisplay
    `);
  }
}

module.exports = Composition;