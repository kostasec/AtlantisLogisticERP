// models/EmployeeInspection.js
const { sql, getPool } = require('../util/db');


class EmployeeInspection {
  static async insert(employeeId, inspectionId, expiryDate, transaction) {
    return new sql.Request(transaction)
      .input('EmployeeID', sql.Int, employeeId)
      .input('InspectionID', sql.Int, inspectionId)
      .input('Date', sql.Date, expiryDate)
      .query(`
        INSERT INTO EmployeeInspection (EmployeeID, InspectionID, Date)
        VALUES (@EmployeeID, @InspectionID, @Date)
      `);
  }

  static async fetchAll() {
    const pool = await getPool();
    return pool.request().query(`
      SELECT InspectionID, Name
      FROM Inspection
      WHERE InspectionType = 'Employee'
    `);
  }
}

module.exports = EmployeeInspection;
