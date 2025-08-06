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
        await pool.request()
            .input('TaxID', sql.VarChar, req.body.TaxID)
            .input('RegNmbr', sql.VarChar, req.body.RegNmbr)
            .input('ClientName', sql.VarChar, req.body.ClientName)
            .input('StreetAndNmbr', sql.VarChar, req.body.StreetAndNmbr)
            .input('City', sql.VarChar, req.body.City)
            .input('ZIP', sql.VarChar, req.body.ZIP)
            .input('Country', sql.VarChar, req.body.Country)
            .input('Email', sql.VarChar, req.body.Email) // Email za Client
            .input('ContactName', sql.VarChar, req.body.ContactName)
            .input('Description', sql.VarChar, req.body.Description)
            .input('PhoneNmbr', sql.VarChar, req.body.PhoneNmbr)
            .input('PersonEmail', sql.VarChar, req.body.PersonEmail) // Email za ContactPerson
            .execute('sp_InsertClientAndContact');
        res.redirect('/admin/client/read');
    } catch (err) {
        console.error('Error inserting client and contact:', err);
        res.status(500).send('Database error');
    }
});



module.exports = router;