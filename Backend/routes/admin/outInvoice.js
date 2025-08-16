const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../../util/db');

// GET /admin/outInvoice/test-connection
router.get('/test-connection', async (req, res) => {
    try {
        const pool = await getPool();
        await pool.connect; // ovo je već povezano, može i da se izostavi
        res.send('Database connection successful!');
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

// GET /admin/outInvoice/read
router.get('/read', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM vw_ReadOutgoingInvoice');
        res.render('outInvoice/read-invoices', {
            pageTitle: 'Outgoing Invoices',
            path: '/admin/outInvoice/read',
            invoices: result.recordset
        });
    } catch (err) {
        console.error('Error fetching invoices:', err);
        res.status(500).send('Database Error');
    }
});

// GET /admin/outInvoice/insert
router.get('/insert', async (req, res) => {
    try {
        const pool = await getPool();

        const [
            clientResult,
            compositionResult,
            vatResult,
            documentStatusResult,
            processingStatusResult,
            paymentStatusResult
        ] = await Promise.all([
            pool.request().query(`SELECT * FROM Client WHERE IsActive=1`),
            pool.request().query(`SELECT CompositionName FROM vw_CompositionDisplay`),
            pool.request().query(`SELECT * FROM VATExamptionReason ORDER BY VATCode, VATExamptionCode`),
            pool.request().query(`SELECT DStatusID FROM DocumentStatusList ORDER BY DStatusID`),
            pool.request().query(`SELECT ProcessingStatusID FROM ProcessingStatusList ORDER BY ProcessingStatusID`),
            pool.request().query(`SELECT PaymentStatusID FROM PaymentStatusList ORDER BY PaymentStatusID`)
        ]);

        res.render('outInvoice/insert-outInvoice', {
            pageTitle: 'New Invoice',
            path: '/admin/outInvoice/insert',
            clients: clientResult.recordset,
            compositions: compositionResult.recordset,
            vatReasons: vatResult.recordset,
            documentStatuses: documentStatusResult.recordset,
            processingStatuses: processingStatusResult.recordset,
            paymentStatuses: paymentStatusResult.recordset
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Database error');
    }
});

// POST /admin/outInvoice/insert
router.post('/insert', async (req, res)=>{

    let{
        OutInvoiceNmbr,
        Currency,           
        ReferenceNmbr,      
        OrderNmbr,          
        TransDate,          
        IssueDate,          
        DueDate,            
        Attachment,         
        Note,               
        DocumentStatus,     
        ProcessingStatus,   
        PaymentStatus,      
        TaxID,             
        serviceItems = []
    } = req.body;

    try {
        const pool = await getPool();

        const serviceItemsTable = new sql.Table('dbo.ServiceItemTvpType');
        serviceItemsTable.columns.add('ServiceType', sql.VarChar(20));
        serviceItemsTable.columns.add('Route', sql.VarChar(100));
        serviceItemsTable.columns.add('Price', sql.Decimal(18, 2));            
        serviceItemsTable.columns.add('TruckID', sql.Int);                     
        serviceItemsTable.columns.add('TrailerID', sql.Int);                   
        serviceItemsTable.columns.add('RegTag', sql.VarChar(30));              
        serviceItemsTable.columns.add('Name', sql.VarChar(100));              
        serviceItemsTable.columns.add('Discount', sql.Decimal(10, 2));        
        serviceItemsTable.columns.add('VATCode', sql.VarChar(6));              
        serviceItemsTable.columns.add('VATExamptionCode', sql.VarChar(50)); 
        
        serviceItems.forEach(s=>{
            serviceItemsTable.rows.add(
                s.ServiceType,
                s.Route,
                s.Price,
                s.TruckID,
                s.TrailerID,
                s.RegTag,
                s.Name,
                s.Discount,
                s.VATCode,
                s.VATExamptionCode
            );
        });

    await pool.request()
        .input('OutInvoiceNmbr', sql.VarChar(50), OutInvoiceNmbr)
        .input('Currency', sql.VarChar(10), Currency)
        .input('ReferenceNmbr', sql.VarChar(50), ReferenceNmbr)
        .input('OrderNmbr', sql.VarChar(50), OrderNmbr)
        .input('TransDate', sql.Date, TransDate)
        .input('IssueDate', sql.Date, IssueDate)
        .input('DueDate', sql.Date, DueDate)
        .input('Attachment', sql.NVarChar(500), Attachment)
        .input('Note', sql.VarChar(255), Note)
        .input('DocumentStatus', sql.Int, DocumentStatus)
        .input('ProcessingStatus', sql.Int, ProcessingStatus)
        .input('PaymentStatus', sql.Int, PaymentStatus)
        .input('TaxID', sql.VarChar(50), TaxID)
        .input('ServiceItems', serviceItemsTable)
        .execute('sp_InsertOutgoingInvoiceWithItems');

        res.redirect('/admin/outInvoice/read');
  } catch (err) {
    console.error('Error upserting client:', err);
    res.status(500).send('Database Error');
  }
});


module.exports = router;
