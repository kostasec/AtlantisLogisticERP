const { sql, getPool } = require('../util/db');

class EmployeeCar {
  static async findByEmployeeId(emplId) {
    const pool = await getPool();
    return pool.request()
      .input('EmplID', sql.Int, emplId)
      .query(`
        SELECT EmplID, CarID
        FROM EmployeeCar
        WHERE EmplID = @EmplID
      `);
  }

  static async insert(emplId, carId, transaction) {
    return new sql.Request(transaction)
      .input('EmplID', sql.Int, emplId)
      .input('CarID', sql.Int, carId)
      .query(`
        INSERT INTO EmployeeCar(EmplID, CarID)
        VALUES (@EmplID, @CarID)
      `);
  }

  static async update(emplId, carId, transaction) {
    return new sql.Request(transaction)
      .input('EmplID', sql.Int, emplId)
      .input('CarID', sql.Int, carId)
      .query(`
        UPDATE EmployeeCar
        SET CarID = @CarID
        WHERE EmplID = @EmplID
      `);
  }

  // Upsert: ako postoji red za datog EmplID → UPDATE; inače INSERT
  static async upsert(emplId, carId, transaction) {
    return new sql.Request(transaction)
      .input('EmplID', sql.Int, emplId)
      .input('CarID', sql.Int, carId)
      .query(`
        IF EXISTS (SELECT 1 FROM EmployeeCar WHERE EmplID = @EmplID)
        BEGIN
          UPDATE EmployeeCar
          SET CarID = @CarID
          WHERE EmplID = @EmplID;
        END
        ELSE
        BEGIN
          INSERT INTO EmployeeCar(EmplID, CarID)
          VALUES (@EmplID, @CarID);
        END
      `);
  }

  static async delete(emplId, transaction) {
    return new sql.Request(transaction)
      .input('EmplID', sql.Int, emplId)
      .query(`
       DELETE FROM EmployeeCar
        WHERE EmplID = @EmplID
      `);
  }

}

module.exports = EmployeeCar;