const express = require ('express');
const router = express.Router();
const { sql, config } = require('../../util/db');

// GET /admin/outInvoice/test-connection
router.get('/test-connection', async (req, res) => {
    try {
        await sql.connect(config);
        res.send('Database connection successful!');
    } catch (err) {
        res.status(500).send('Error:' + err.message);
    }
  
    
});


//GET //admin/outInvoice/read
router.get('/read', async (req, res)=>{
    try{
        let pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT * FROM vw_OutgoingInvoiceRead 
            `);
    res.render('invoices/read-invoices',{
            pageTitle: 'Outgoing Invoices',
            path: '/admin/outInvoice/read',
            invoices: result.recordset
        });

    } catch(err){
        console.error('Error fetching invoices:', err);
        res.status(500).send('Database Error');
    }
});


module.exports = router;