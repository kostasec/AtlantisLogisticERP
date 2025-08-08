const express = require('express');
const router = express.Router();
const { sql, config } = require('../../util/db');

// GET /admin/vehicle/test-connection
router.get('/test-connection', async (req, res) => {
    try {
        await sql.connect(config);
        res.send('Database connection successful!');
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

//GET /admin/client/read
router.get('/read', async (req, res)=>{
    try{
        let pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT *
            FROM Client
            WHERE IsActive=1
            `);
        res.render('client/read-client',{
            pageTitle: 'All Clients',
            path: '/admin/client/read',
            clients: result.recordset
        });
    } catch(err) {
        console.error('Error fetching clients: ', err);
        res.status(500).send('Database Error')
    }
});


module.exports = router;