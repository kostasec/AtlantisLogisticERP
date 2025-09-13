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

        res.render('outInvoice/read-invoices', {
            pageTitle: 'Outgoing Invoices',
            path: '/outInvoice/read',
            invoices: result.recordset
        });
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