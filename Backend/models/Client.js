const { sql, getPool } = require('../util/db');

class Client{
    static async fetchAll(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT *
            FROM vw_ClientWithContacts
            `);
    }

    static async fetchClient(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT *
            FROM Client
            WHERE IsActive=1
            `);
    }

    static async findClientByTaxId(taxId){
        const pool = await getPool();
        return pool.request()
        .input('TaxID', sql.VarChar(50), taxId)
        .query(`
            SELECT *
            FROM Client
            WHERE TaxID = @TaxID
            `);
    }

    static async findContactsByTaxId(taxId){
        const pool = await getPool();
        return pool.request()
        .input('TaxID', sql.VarChar(50), taxId)
        .query(`
            SELECT ContactPersonID, ContactName, [Description], PhoneNmbr, PersonEmail
            FROM ContactPerson
            WHERE TaxID = @TaxID
            `);
    }

    // Ažuriran metod za unos i ažuriranje klijenta
    static async upsert(reqBody, transaction) {
        let {
            TaxID,
            RegNmbr,
            ClientName,
            StreetAndNmbr,
            City,
            ZIP,
            Country,
            Email,
            contacts = []
        } = reqBody;

        const regNmbrValue = RegNmbr && RegNmbr.trim() !== '' ? RegNmbr.trim() : null;

        const clientExists = await new sql.Request(transaction)
            .input('TaxID', sql.VarChar(50), TaxID)
            .query('SELECT COUNT(1) AS Cnt FROM dbo.Client WHERE TaxID = @TaxID');

        if (clientExists.recordset[0].Cnt > 0) {
            // UPDATE
            await new sql.Request(transaction)
                .input('TaxID', sql.VarChar(50), TaxID)
                .input('RegNmbr', sql.VarChar(30), regNmbrValue)
                .input('ClientName', sql.VarChar(100), ClientName)
                .input('StreetAndNmbr', sql.VarChar(100), StreetAndNmbr)
                .input('City', sql.VarChar(50), City)
                .input('ZIP', sql.VarChar(10), ZIP)
                .input('Country', sql.VarChar(50), Country)
                .input('Email', sql.VarChar(100), Email)
                .query(`
                    UPDATE dbo.Client
                    SET RegNmbr = @RegNmbr,
                        ClientName = @ClientName,
                        StreetAndNmbr = @StreetAndNmbr,
                        City = @City,
                        ZIP = @ZIP,
                        Country = @Country,
                        Email = @Email,
                        IsActive = 1
                    WHERE TaxID = @TaxID
                `);
        } else {
            // INSERT
            await new sql.Request(transaction)
                .input('TaxID', sql.VarChar(50), TaxID)
                .input('RegNmbr', sql.VarChar(30), regNmbrValue || null)
                .input('ClientName', sql.VarChar(100), ClientName)
                .input('StreetAndNmbr', sql.VarChar(100), StreetAndNmbr)
                .input('City', sql.VarChar(50), City)
                .input('ZIP', sql.VarChar(10), ZIP)
                .input('Country', sql.VarChar(50), Country)
                .input('Email', sql.VarChar(100), Email)
                .query(`
                    INSERT INTO dbo.Client (TaxID, RegNmbr, ClientName, StreetAndNmbr, City, ZIP, Country, Email, IsActive)
                    VALUES (@TaxID, @RegNmbr, @ClientName, @StreetAndNmbr, @City, @ZIP, @Country, @Email, 1)
                `);
        }

        // Ažuriranje kontakata
        for (const c of contacts) {
            if (c.ContactPersonID) {
                // UPDATE postojećeg kontakta
                await new sql.Request(transaction)
                    .input('ContactPersonID', sql.Int, parseInt(c.ContactPersonID))
                    .input('ContactName', sql.VarChar(100), c.ContactName)
                    .input('Description', sql.VarChar(200), c.Description || null)
                    .input('PhoneNmbr', sql.VarChar(50), c.PhoneNmbr || null)
                    .input('PersonEmail', sql.VarChar(100), c.PersonEmail || null)
                    .input('TaxID', sql.VarChar(50), TaxID)
                    .query(`
                        UPDATE dbo.ContactPerson
                        SET ContactName = @ContactName,
                            [Description] = @Description,
                            PhoneNmbr = @PhoneNmbr,
                            PersonEmail = @PersonEmail
                        WHERE ContactPersonID = @ContactPersonID AND TaxID = @TaxID
                    `);
            } else {
                // INSERT novog kontakta
                await new sql.Request(transaction)
                    .input('TaxID', sql.VarChar(50), TaxID)
                    .input('ContactName', sql.VarChar(100), c.ContactName)
                    .input('Description', sql.VarChar(200), c.Description || null)
                    .input('PhoneNmbr', sql.VarChar(50), c.PhoneNmbr || null)
                    .input('PersonEmail', sql.VarChar(100), c.PersonEmail || null)
                    .query(`
                        INSERT INTO dbo.ContactPerson (TaxID, ContactName, [Description], PhoneNmbr, PersonEmail)
                        VALUES (@TaxID, @ContactName, @Description, @PhoneNmbr, @PersonEmail)
                    `);
            }
        }
    }

    static async deleteClient(id, transaction){
        return new sql.Request(transaction)
        .input('TaxID', sql.VarChar(50), id)
        .query(`
            UPDATE CLIENT 
            SET IsActive = 0
            WHERE TaxID = @TaxID
            `);
    }

    static async deleteContact(id, transaction){
        return new sql.Request(transaction)
        .input('TaxID', sql.VarChar(50), id)
        .query(`
            DELETE FROM ContactPerson
            WHERE TaxID = @TaxID
            `);

    }

 }


module.exports = Client;