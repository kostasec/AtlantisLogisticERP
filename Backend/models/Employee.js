 // models/Employee.js
const { sql, getPool } = require('../util/db');

class Employee {
  
  static async fetchAll() {
    const pool = await getPool();
    return pool.request().query(`
      SELECT * FROM vw_EmployeeBack
      WHERE Status='Active'
    `);
  }

  static async fetchDrivers(){
    const pool = await getPool();
    return pool.request().query(`
        SELECT EmplID, FirstName, LastName
        FROM Employee
        WHERE EmplType='Driver'
        `);
  }
  

  static async findById(id) {
    const pool = await getPool();
    return pool.request()
      .input('EmplID', sql.Int, id)
      .query(`
        SELECT *
        FROM Employee
        WHERE EmplID = @EmplID
      `);
  }

  static async fetchManagers() {
    const pool = await getPool();
    return pool.request().query(`
      SELECT EmplID, FirstName, LastName 
      FROM Employee 
      WHERE EmplType LIKE '%Director%' AND Status = 'Active';
    `);
  }
//deo logike sa kontrolera je definisan ovde predpostavljam da je lakse bilo
  static async insert(reqBody, transaction) {
  const mgrIdValue = (reqBody.MgrID && String(reqBody.MgrID).trim() !== '') ? parseInt(reqBody.MgrID, 10) : null;

    const result = await new sql.Request(transaction)
      .input('EmplType', sql.VarChar, reqBody.EmplType)
      .input('FirstName', sql.VarChar, reqBody.FirstName)
      .input('LastName', sql.VarChar, reqBody.LastName)
      .input('StreetAndNmbr', sql.VarChar, reqBody.StreetAndNmbr)
      .input('City', sql.VarChar, reqBody.City)
      .input('ZIPCode', sql.VarChar, reqBody.ZIPCode)
      .input('Country', sql.VarChar, reqBody.Country)
      .input('PhoneNmbr', sql.VarChar, reqBody.PhoneNmbr)
      .input('EmailAddress', sql.VarChar, reqBody.EmailAddress)
      .input('IDCardNmbr', sql.VarChar, reqBody.IDCardNmbr)
      .input('PassportNmbr', sql.VarChar, reqBody.PassportNmbr)
      .input('MgrID', sql.Int, mgrIdValue)
      .query(`
        INSERT INTO Employee 
        (EmplType, FirstName, LastName, StreetAndNmbr, City, ZIPCode, Country, PhoneNmbr, EmailAddress, IDCardNmbr, PassportNmbr, MgrID)
        VALUES 
        (@EmplType, @FirstName, @LastName, @StreetAndNmbr, @City, @ZIPCode, @Country, @PhoneNmbr, @EmailAddress, @IDCardNmbr, @PassportNmbr, @MgrID);
        SELECT SCOPE_IDENTITY() AS EmplID;
      `);

    return result.recordset[0].EmplID;
  }

  static async update(id, reqBody, transaction) {
    const mgrIdValue = (reqBody.MgrID && String(reqBody.MgrID).trim() !== '') ? parseInt(reqBody.MgrID, 10) : null;

    return new sql.Request(transaction)
      .input('EmplID', sql.Int, parseInt(id, 10))
      .input('EmplType', sql.VarChar, reqBody.EmplType)
      .input('FirstName', sql.VarChar, reqBody.FirstName)
      .input('LastName', sql.VarChar, reqBody.LastName)
      .input('StreetAndNmbr', sql.VarChar, reqBody.StreetAndNmbr)
      .input('City', sql.VarChar, reqBody.City)
      .input('ZIPCode', sql.VarChar, reqBody.ZIPCode)
      .input('Country', sql.VarChar, reqBody.Country)
      .input('PhoneNmbr', sql.VarChar, reqBody.PhoneNmbr)
      .input('EmailAddress', sql.VarChar, reqBody.EmailAddress)
      .input('IDCardNmbr', sql.VarChar, reqBody.IDCardNmbr)
      .input('PassportNmbr', sql.VarChar, reqBody.PassportNmbr)
      .input('MgrID', sql.Int, mgrIdValue)
      .query(`
        UPDATE Employee SET
            EmplType = @EmplType,
            FirstName = @FirstName,
            LastName = @LastName,
            StreetAndNmbr = @StreetAndNmbr,
            City = @City,
            ZIPCode = @ZIPCode,
            Country = @Country,
            PhoneNmbr = @PhoneNmbr,
            EmailAddress = @EmailAddress,
            IDCardNmbr = @IDCardNmbr,
            PassportNmbr = @PassportNmbr,
            MgrID = @MgrID
        WHERE EmplID = @EmplID
      `);
  }

  static async softDelete(id, transaction) {
    return new sql.Request(transaction)
      .input('EmplID', sql.Int, parseInt(id, 10))
      .query(`UPDATE Employee SET Status = 'Inactive' WHERE EmplID = @EmplID`);
  }
}

module.exports = Employee;