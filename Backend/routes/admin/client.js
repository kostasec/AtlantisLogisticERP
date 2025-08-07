const express = require('express');
const router = express.Router();
const { sql, config } = require ('../../util/db');


// GET /admin/employee/test-connection
router.get('/test-connection', async (req, res) => {
    try {
        await sql.connect(config);
        res.send('Database connection successful!');
    } catch (err) {
        res.status(500).send('Error:' + err.message);
    }
});


//GET /admin/client/read
router.get('/read', async (req, res)=>{
    try{
        let pool = await sql.connect(config);
        // Isčitavanje klijenata sa kontakt osobama
        const result = await pool.request().query(`
            SELECT c.TaxID, c.ClientName, c.RegNmbr, c.StreetAndNmbr, c.City, c.ZIP, c.Country, c.Email,
                   cp.ContactName, cp.Description, cp.PhoneNmbr, cp.PersonEmail
            FROM Client c
            LEFT JOIN ContactPerson cp ON c.TaxID = cp.TaxID
            WHERE c.IsActive=1
        `);

        // Grupisanje po klijentu (po TaxID)
        const clientsMap = {};
        for (const row of result.recordset) {
            if (!clientsMap[row.TaxID]) {
                clientsMap[row.TaxID] = {
                    TaxID: row.TaxID,
                    ClientName: row.ClientName,
                    RegNmbr: row.RegNmbr,
                    StreetAndNmbr: row.StreetAndNmbr,
                    City: row.City,
                    ZIP: row.ZIP,
                    Country: row.Country,
                    Email: row.Email,
                    contacts: []
                };
            }
            if (row.ContactName) {
                clientsMap[row.TaxID].contacts.push({
                    ContactName: row.ContactName,
                    Description: row.Description,
                    PhoneNmbr: row.PhoneNmbr,
                    PersonEmail: row.PersonEmail
                });
            }
        }
        const clients = Object.values(clientsMap);
        res.render('client/read-client',{
            pageTitle: 'Clients & Contacts',
            path: '/admin/client/read',
            clients
        });
    } catch(err) {
        console.error('Error fetching contacts', err);
        res.status(500). send('Database Error');
    }
});

//GET /admin/client/insert
router.get('/insert', async (req, res, next)=>{
    try{
        let pool = await sql.connect(config);
        res.render('client/insert-client',{
            pageTitle: 'Add Client',
            path: '/admin/client/insert'
        });
    } catch (err){
        console.error('Error fetching clients: ',err);
        res.status(500).send('Database error')
    }
});


//POST /admin/client/insert
router.post('/insert', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        // Prvo dodaj klijenta bez kontakt osoba
        // Pretpostavljam da procedura može da doda klijenta bez kontakta, ili imaš posebnu proceduru za klijenta
        // Ako ne, ovde dodaj insert za klijenta i uzmi ClientID
        // Ako je kontakt osoba obavezna, onda se prva kontakt osoba šalje odmah

        // Pripremi podatke
        const {
            TaxID, RegNmbr, ClientName, StreetAndNmbr, City, ZIP, Country, Email,
            ContactName, Description, PhoneNmbr, PersonEmail
        } = req.body;

        // Kontakt osobe su nizovi
        const contactNames = Array.isArray(ContactName) ? ContactName : (ContactName ? [ContactName] : []);
        const descriptions = Array.isArray(Description) ? Description : (Description ? [Description] : []);
        const phoneNmbrs = Array.isArray(PhoneNmbr) ? PhoneNmbr : (PhoneNmbr ? [PhoneNmbr] : []);
        const personEmails = Array.isArray(PersonEmail) ? PersonEmail : (PersonEmail ? [PersonEmail] : []);

        // Ako nema kontakt osoba, dodaj samo klijenta
        if (contactNames.length === 0) {
            await pool.request()
                .input('TaxID', sql.VarChar, TaxID)
                .input('RegNmbr', sql.VarChar, RegNmbr)
                .input('ClientName', sql.VarChar, ClientName)
                .input('StreetAndNmbr', sql.VarChar, StreetAndNmbr)
                .input('City', sql.VarChar, City)
                .input('ZIP', sql.VarChar, ZIP)
                .input('Country', sql.VarChar, Country)
                .input('Email', sql.VarChar, Email)
                .input('ContactName', sql.VarChar, null)
                .input('Description', sql.VarChar, null)
                .input('PhoneNmbr', sql.VarChar, null)
                .input('PersonEmail', sql.VarChar, null)
                .execute('sp_InsertClientAndContact');
        } else {
            // Dodaj klijenta sa svakom kontakt osobom
            for (let i = 0; i < contactNames.length; i++) {
                await pool.request()
                    .input('TaxID', sql.VarChar, TaxID)
                    .input('RegNmbr', sql.VarChar, RegNmbr)
                    .input('ClientName', sql.VarChar, ClientName)
                    .input('StreetAndNmbr', sql.VarChar, StreetAndNmbr)
                    .input('City', sql.VarChar, City)
                    .input('ZIP', sql.VarChar, ZIP)
                    .input('Country', sql.VarChar, Country)
                    .input('Email', sql.VarChar, Email)
                    .input('ContactName', sql.VarChar, contactNames[i] || null)
                    .input('Description', sql.VarChar, descriptions[i] || null)
                    .input('PhoneNmbr', sql.VarChar, phoneNmbrs[i] || null)
                    .input('PersonEmail', sql.VarChar, personEmails[i] || null)
                    .execute('sp_InsertClientAndContact');
            }
        }
        res.redirect('/admin/client/read');
    } catch (err) {
        console.error('Error inserting client and contact:', err);
        res.status(500).send('Database error');
    }
});





module.exports = router;