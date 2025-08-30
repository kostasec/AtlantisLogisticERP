const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../../util/db');


// GET /admin/outInvoice/read
router.get('/read', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM vw_OutInvoiceBackend');
        
        res.render('outInvoice/read-invoices', {
            pageTitle: 'Outgoing Invoices',
            path: '/admin/outInvoice/read',
            invoices:result.recordset
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
            pool.request().query(`SELECT * FROM vw_CompositionDisplay`),
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
router.post('/insert', async (req, res) => {
  let {
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

  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 1) Insert u OutgoingInvoice
    const invoiceResult = await new sql.Request(transaction)
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
      .query(`
        INSERT INTO dbo.OutgoingInvoice (
          OutInvoiceNmbr, ReferenceNmbr, OrderNmbr,
          TransDate, IssueDate, DueDate,
          Attachment, Note,
          PaymentStatus, ProcessingStatus, TaxID, Currency, DocumentStatus
        )
        VALUES (
          @OutInvoiceNmbr, @ReferenceNmbr, @OrderNmbr,
          @TransDate, @IssueDate, @DueDate,
          @Attachment, @Note,
          @PaymentStatus, @ProcessingStatus, @TaxID, @Currency, @DocumentStatus
        );
        SELECT SCOPE_IDENTITY() AS InvoiceID;
      `);

    const invoiceID = invoiceResult.recordset[0].InvoiceID;

    // 2) Iteracija kroz serviceItems
    for (const s of serviceItems) {
      // 2a) Insert u Service
      const serviceResult = await new sql.Request(transaction)
        .input('ServiceType', sql.VarChar(20), s.ServiceType)
        .query(`
          INSERT INTO dbo.Service (ServiceType)
          VALUES (@ServiceType);
          SELECT SCOPE_IDENTITY() AS ServiceID;
        `);

      const serviceID = serviceResult.recordset[0].ServiceID;

      // 2b) Insert u odgovarajuću podtabelu
      if (s.ServiceType === 'Transportation') {
        await new sql.Request(transaction)
          .input('ServiceID', sql.Int, serviceID)
          .input('Route', sql.VarChar(100), s.Route)
          .input('Price', sql.Decimal(18, 2), s.Price)
          .input('TruckID', sql.Int, s.TruckID)
          .input('TrailerID', sql.Int, s.TrailerID)
          .query(`
            INSERT INTO dbo.TransportationService (ServiceID, Route, Price, TruckID, TrailerID)
            VALUES (@ServiceID, @Route, @Price, @TruckID, @TrailerID)
          `);
      } else if (s.ServiceType === 'Outsorcing') {
        await new sql.Request(transaction)
          .input('ServiceID', sql.Int, serviceID)
          .input('Route', sql.VarChar(100), s.Route)
          .input('Price', sql.Decimal(18, 2), s.Price)
          .input('RegTag', sql.VarChar(30), s.RegTag)
          .query(`
            INSERT INTO dbo.OutsorcingService (ServiceID, Route, Price, RegTag)
            VALUES (@ServiceID, @Route, @Price, @RegTag)
          `);
      } else if (s.ServiceType === 'Taxes') {
        await new sql.Request(transaction)
          .input('ServiceID', sql.Int, serviceID)
          .input('Name', sql.VarChar(100), s.Name)
          .input('Price', sql.Decimal(18, 2), s.Price)
          .query(`
            INSERT INTO dbo.TaxService (ServiceID, Name, Price)
            VALUES (@ServiceID, @Name, @Price)
          `);
      }

      // 2c) Insert u Item
      await new sql.Request(transaction)
        .input('InvoiceID', sql.Int, invoiceID)
        .input('ServiceID', sql.Int, serviceID)
        .input('Discount', sql.Decimal(10, 2), s.Discount || 0)
        .input('VATCode', sql.VarChar(6), s.VATCode)
        .input('VATExamptionCode', sql.VarChar(50), s.VATExamptionCode)
        .query(`
          INSERT INTO dbo.Item (InvoiceID, ServiceID, Discount, VATCode, VATExamptionCode)
          VALUES (@InvoiceID, @ServiceID, @Discount, @VATCode, @VATExamptionCode)
        `);
    }

    await transaction.commit();
    res.redirect('/admin/outInvoice/read');
  } catch (err) {
    await transaction.rollback();
    console.error('Error inserting invoice with items:', err);
    res.status(500).send('Database Error');
  }
});



module.exports = router;
