const { sql, getPool } = require('../util/db');

class Trailer{
    static async fetchAll(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT * FROM Trailer
            `)
    }

    static async insert(reqBody, transaction){
    const trailerResult = await new sql.Request(transaction)
            .input('Make', sql.VarChar, reqBody.TrailerMake)
            .input('Model', sql.VarChar, reqBody.TrailerModel)
            .input('RegistrationTag', sql.VarChar, reqBody.TrailerRegistrationTag)
            .input('Status', sql.VarChar, 'Active')
            .query(`
                INSERT INTO Trailer (Make, Model, RegistrationTag, Status)
                VALUES (@Make, @Model, @RegistrationTag, @Status);
                SELECT SCOPE_IDENTITY() AS TrailerID;
            `);

        return trailerResult.recordset[0].TrailerID; 
    }

}

module.exports = Trailer;