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
        const result = await pool.request().execute('dbo.sp_ReadOutgoingInvoices');
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
            pool.request().query(`SELECT TaxID FROM Client ORDER BY TaxID`),
            pool.request().query(`SELECT TruckID, TrailerID FROM Composition ORDER BY TruckID, TrailerID`),
            pool.request().query(`SELECT * FROM VATExamptionReason ORDER BY VATCode, VATExamptionCode`),
            pool.request().query(`SELECT * FROM DocumentStatusList ORDER BY DStatusID`),
            pool.request().query(`SELECT * FROM ProcessingStatusList ORDER BY ProcessingStatusID`),
            pool.request().query(`SELECT * FROM PaymentStatusList ORDER BY PaymentStatusID`)
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
router.post('/insert', async (req, res) => {
    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        const {
            OutInvoiceNmbr,
            ReferenceNmbr,
            OrderNmbr,
            TransDate,
            IssueDate,
            DueDate,
            Attachment,
            Note,
            PaymentStatus,
            ProcessingStatus,
            TaxID,
            Currency,
            DStatusID,
            Sent,
            Delivered,
            Services,
            Items
        } = req.body;

        // 1. Insert OutgoingInvoice
        const invoiceResult = await new sql.Request(transaction)
            .input('OutInvoiceNmbr', sql.VarChar(50), OutInvoiceNmbr)
            .input('ReferenceNmbr', sql.VarChar(50), ReferenceNmbr)
            .input('OrderNmbr', sql.VarChar(50), OrderNmbr || null)
            .input('TransDate', sql.Date, TransDate)
            .input('IssueDate', sql.Date, IssueDate)
            .input('DueDate', sql.Date, DueDate)
            .input('Attachment', sql.NVarChar(500), Attachment || null)
            .input('Note', sql.VarChar(255), Note || null)
            .input('PaymentStatus', sql.TinyInt, PaymentStatus)
            .input('ProcessingStatus', sql.TinyInt, ProcessingStatus)
            .input('TaxID', sql.VarChar(50), TaxID)
            .input('Currency', sql.VarChar(10), Currency)
            .input('DStatusID', sql.Int, DStatusID)
            .input('Sent', sql.Date, Sent || null)
            .input('Delivered', sql.Date, Delivered || null)
            .query(`
                INSERT INTO dbo.OutgoingInvoice (
                    OutInvoiceNmbr, ReferenceNmbr, OrderNmbr,
                    TransDate, IssueDate, DueDate,
                    Attachment, Note,
                    PaymentStatus, ProcessingStatus,
                    TaxID, Currency, DStatusID, Sent, Delivered
                )
                OUTPUT inserted.InvoiceID
                VALUES (
                    @OutInvoiceNmbr, @ReferenceNmbr, @OrderNmbr,
                    @TransDate, @IssueDate, @DueDate,
                    @Attachment, @Note,
                    @PaymentStatus, @ProcessingStatus,
                    @TaxID, @Currency, @DStatusID, @Sent, @Delivered
                )
            `);

        const invoiceID = invoiceResult.recordset[0].InvoiceID;

        // 2. Insert Services
        const serviceIdMap = new Map();
        for (const s of Services) {
            const result = await new sql.Request(transaction)
                .input('ServiceName', sql.VarChar(100), s.ServiceName)
                .input('Price', sql.Decimal(9, 2), s.Price)
                .input('TransportationType', sql.VarChar(10), s.TransportationType || null)
                .input('TruckID', sql.Int, s.TruckID || null)
                .input('TrailerID', sql.Int, s.TrailerID || null)
                .query(`
                    INSERT INTO dbo.Service (ServiceName, Price, TransportationType, TruckID, TrailerID)
                    OUTPUT inserted.ServiceID
                    VALUES (@ServiceName, @Price, @TransportationType, @TruckID, @TrailerID)
                `);

            serviceIdMap.set(s.ServiceName, result.recordset[0].ServiceID);
        }

        // 3. Insert Items
        for (const i of Items) {
            const serviceID = serviceIdMap.get(i.ServiceName);
            if (!serviceID) throw new Error(`ServiceName '${i.ServiceName}' does not exist in Services.`);

            await new sql.Request(transaction)
                .input('InvoiceID', sql.Int, invoiceID)
                .input('ServiceID', sql.Int, serviceID)
                .input('Discount', sql.Decimal(5, 2), i.Discount || 0)
                .input('VATCode', sql.VarChar(6), i.VATCode)
                .input('VATExamptionCode', sql.VarChar(50), i.VATExamptionCode || null)
                .query(`
                    INSERT INTO dbo.Item (InvoiceID, ServiceID, Discount, VATCode, VATExamptionCode)
                    VALUES (@InvoiceID, @ServiceID, @Discount, @VATCode, @VATExamptionCode)
                `);
        }

        await transaction.commit();
        res.redirect('/admin/outInvoice/read');
    } catch (err) {
        console.error('Error inserting new invoice:', err);
        res.status(500).send('Database error');
    }
});

module.exports = router;
