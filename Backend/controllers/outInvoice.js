const { sql, getPool } = require('../util/db');
const OutInvoice = require('../models/OutInvoice');
const Client = require('../models/Client');
const Composition = require('../models/Composition');
const Vat = require('../models/Vat');
const DocumentStatus = require('../models/DocumentStatus');
const ProcessingStatus = require('../models/ProcessingStatus');
const PaymentStatus = require('../models/PaymentStatus');

exports.getReadInvoice = async (req, res, next) => {
    try {
        const result = await OutInvoice.fetchAll();

        // Proveri da li je zahtev za API (JSON)
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            // Transformacija podataka za frontend format
            const transformedInvoices = result.recordset.map(invoice => {
        
            return{
               id: invoice.InvoiceNumber, // Jedinstveni identifikator za React key
               documentStatus: invoice.DocumentStatus,
               processingStatus: invoice.ProcessingStatus,
               issueDate: invoice.IssueDate,
               sendDate: invoice.SendDate,
               deliveredDate: invoice.DeliveredDate,
               dueDate: invoice.DueDate,
               recipient: invoice.Recipient,
               invoiceNumber: invoice.InvoiceNumber,
               amount: invoice.Amount,
               currency: invoice.Currency,      
               paymentStatus: invoice.PaymentStatusName        
            };
        });

        return res.json({
            success: true,
            data: transformedInvoices
        });
    }

      
    } catch (err) {
        console.error('Error fetching invoices:', err);
        res.status(500).send('Database Error');
    }
};

// Render the insert invoice form with lookup data
exports.getInsertInvoice = async (req, res, next) => {
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
            Client.fetchClient(),
            Composition.fetchAll(),
            Vat.fetchAll(),
            DocumentStatus.fetchAll(),
            ProcessingStatus.fetchAll(),
            PaymentStatus.fetchAll()
        ]);
        res.render('outInvoice/insert-outInvoice', {
            pageTitle: 'New Invoice',
            path: '/outInvoice/insert',
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
};

// Handle creating a new invoice with items
exports.postInsertInvoice = async (req, res, next) => {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
  try {
    await transaction.begin();
    const insertedOutInvoice = await OutInvoice.insert(req.body, transaction);
    await transaction.commit();
    res.redirect('/outInvoice/read');
  } catch (err) {
  await transaction.rollback();
    console.error('Error inserting invoice with items:', err);
    res.status(500).send('Database Error');
  }

};