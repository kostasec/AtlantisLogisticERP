const { sql, getPool } = require('../util/db');
const IncInvoice = require('../models/IncInvoice');

exports.getReadAllIncInv = async (req, res, next) => {
    try {
        const result = await IncInvoice.fetchAllIncInv();

         if (req.headers.accept && req.headers.accept.includes('application/json')) {
            // Transformacija podataka za frontend format
            const transformedInvoices = result.recordset.map(invoice => {   
            return {
                id: invoice.InvoiceNmbr, // Jedinstveni identifikator za React key
                documentStatus: invoice.DStatusName,
                processingStatus: invoice.ProcessingStatusName,
                sender: invoice.Sender,
                invoiceNumber: invoice.InvoiceNmbr,
                paymentStatus: invoice.PaymentStatusName

            };
        });

        return res.json({
            success: true,
            data: transformedInvoices
        });
    }

        // Fallback to render view for HTML requests
        res.render('incInvoice/read-invoices', {
            title: 'Incoming Invoices',
            invoices: result.recordset
        });

    } catch (err) {
        console.error('Error fetching invoices:', err);
        res.status(500).send('Database Error');
    }
};

exports.getReadInvoiceCarrier = async (req, res, next) => {
    try {
        const result = await IncInvoice.fetchIncInvCarrier();

         if (req.headers.accept && req.headers.accept.includes('application/json')) {
            // Transformacija podataka za frontend format
            const transformedInvoices = result.recordset.map(invoice => {

            return {
               id: invoice.InvoiceNmbr, // Jedinstveni identifikator za React key
               dueDate: invoice.DueDate,
               sender: invoice.Sender,
               amount: invoice.Amount,
               currency:invoice.Currency,
               invoiceNumber: invoice.InvoiceNmbr,
               paymentStatus: invoice.PaymentStatusName
                };
            });

            return res.json({
            success: true,
            data: transformedInvoices
        });
        }

        // Fallback to render view for HTML requests  
        res.render('incInvoice/read-invoices-carrier', {
            title: 'Carrier Incoming Invoices',
            invoices: result.recordset
        });

        } catch (err) {
            console.error('Error fetching invoices:', err);
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                res.status(500).json({
                    success: false,
                    message: 'Database Error'
                });
            } else {
                res.status(500).send('Database Error');
            }
        }
};

exports.getReadInvoiceOther = async (req, res, next) => {
        try {
            const result = await IncInvoice.fetchIncInvOther();

                if (req.headers.accept && req.headers.accept.includes('application/json')) {
                    // Transformacija podataka za frontend format
                    const transformedInvoices = result.recordset.map(invoice => {
                    
                        return {
                        id: invoice.InvoiceNmbr, // Jedinstveni identifikator za React key
                        dueDate: invoice.DueDate,
                        sender: invoice.Sender,
                        amount: invoice.Amount,
                        currency:invoice.Currency,
                        invoiceNumber: invoice.InvoiceNmbr,
                        paymentStatus: invoice.PaymentStatusName  
                        };
                    });

                    return res.json({
                    success: true,
                    data: transformedInvoices
                });
                }

                // Fallback to render view for HTML requests
                res.render('incInvoice/read-invoices-others', {
                    title: 'Other Incoming Invoices',
                    invoices: result.recordset
                });
            
            } catch (err) {
                console.error('Error fetching invoices:', err);
                if (req.headers.accept && req.headers.accept.includes('application/json')) {
                    res.status(500).json({
                        success: false,
                        message: 'Database Error'
                    });
                } else {
                    res.status(500).send('Database Error');
                }
            }
};

