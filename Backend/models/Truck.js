const { sql, getPool } = require('../util/db');

class Truck{

    static async fetchAll(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT * FROM Truck
            `)
    }

    static async insert(reqBody, transaction){
        const truckResult = await new sql.Request(transaction)
            .input('Make', sql.VarChar, reqBody.TruckMake)
            .input('Model', sql.VarChar, reqBody.TruckModel)
            .input('RegistrationTag', sql.VarChar, reqBody.TruckRegistrationTag)
            .input('Status', sql.VarChar, 'Active')
            .query(`
                INSERT INTO Truck (Make, Model, RegistrationTag, Status)
                VALUES (@Make, @Model, @RegistrationTag, @Status);
                SELECT SCOPE_IDENTITY() AS TruckID;
            `);

        return truckResult.recordset[0].TruckID; 
    }
}

module.exports = Truck;