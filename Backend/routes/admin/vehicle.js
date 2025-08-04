const express = require('express');
const router = express.Router();
const { sql, config} = require('../../util/db');

//GET /admin/vehicle/all
router.get('/all', async(req, res)=>{
    try{
        let pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM Vehicle");
        res.render('vehicle/all-vehicles', {
            pageTitle: 'All Vehicles',
            path: '/admin/vehicle/all',
            vehicles: result.recordset
        });
    } catch(err) {
        console.error('Error fetching vehicles', err);
        res.status(500).send('Database Error');
    }

})

module.exports = router;

