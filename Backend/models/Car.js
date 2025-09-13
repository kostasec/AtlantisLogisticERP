const { sql, getPool } = require('../util/db');

class Car{

    static async fetchAll(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT * FROM Car
            `)
    }    

    static async insert(carId, make, model, registrationTag, status, transaction){
        return new sql.Request(transaction)
        .input('CarID', sql.Int, carId)
        .input('Make', sql.Varchar, make)
        .input('Model', sql.Varchar, model)
        .input('RegistrationTag', sql.Varchar, registrationTag)
        .input('Status', sql.Varchar, status)
        .query(`
            INSERT INTO Car(CarID, Make, Model, RegistrationTag, Status)
            VALUES (@CarID, @Make, @Model, @RegistrationTag, @Status)
            `);
        }

    static async delete(carId, transaction){
        return new sql.Request(transaction)
        .input('CarID', sql.Int, carId)
        .query(`
                UPDATE Car
                SET Status='Inactive'
                WHERE CarID=@CarID
            `);
        }
    }
    

module.exports = Car;