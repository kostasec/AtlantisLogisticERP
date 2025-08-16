const request = require('supertest');
const express = require('express');
const { expect } = require('chai');
const outInvoiceRouter = require('../routes/admin/outInvoice');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/admin/outInvoice', outInvoiceRouter);

describe('OutInvoice routes', ()=>{
    it('GET /admin/outInvoice/read should return 200', async() => {
        const res = await request(app).get('/admin/outInvoice/read');
        expect(res.statusCode).to.equal(200);
    });

    it('GET /admin/outInvoice/insert should return 200', async () => {
        const res = await request(app).get('/admin/outInvoice/insert');
        expect(res.statusCode).to.equal(200);
    });

    it('POST /admin/outInvoice/insert should handle missing data', async () => {
        const res = await request(app)
          .post('/admin/outInvoice/insert')
          .send({}); // empty body
        expect(res.statusCode).to.equal(500); //we're expecting error due to empty body
    });

    it('POST /admin/outInvoice/insert should insert outgoing invoice with 2 service items', async function () {
        const invoicePayload = {
            OutInvoiceNmbr: 'MOCHATEST-21',
            Currency: 'RSD',
            ReferenceNmbr: 'REF-01',
            OrderNmbr: 'ORD-001',
            TransDate: '2025-08-15',
            IssueDate: '2025-08-15',
            DueDate: '2025-10-15',
            Attachment: '',
            Note: 'Test Invoice',
            DocumentStatus: 1,
            ProcessingStatus: 1,
            PaymentStatus: 1,
            TaxID: 'RS123456789',
            serviceItems: [
                {
                    ServiceType: 'Transportation',
                    Route: 'Olesnica - Subtoica',
                    Price: 100000,
                    TruckID: 1,
                    TrailerID: 2,
                    RegTag: null,
                    Name: null,
                    Discount: null,
                    VATCode: 'S20',
                    VATExamptionCode: 'None'
                },
                {
                    ServiceType: 'Taxes',
                    Route: null,
                    Price: 2000,
                    TruckOD: null,
                    TrailerID: null,
                    RegTag: null,
                    Name: 'Fito',
                    Discount: 0,
                    VATCode: 'O',
                    VATExamptionCode: 'PDV-RS-12-4'
                }
            ]
        };
       const res = await request(app)
      .post('/admin/outInvoice/insert')
      .set('Content-Type', 'application/json') // eksplicitno, mada i nije neophodno
      .send(invoicePayload);
      expect(res.statusCode).to.equal(302); // očekujemo redirect ako insert prođe
  });

   it('POST /admin/outInvoice/insert should insert outgoing invoice with 1 service item', async function () {
        const invoicePayload = {
            OutInvoiceNmbr: 'MOCHATEST-22',
            Currency: 'RSD',
            ReferenceNmbr: 'REF-01',
            OrderNmbr: 'ORD-001',
            TransDate: '2025-08-15',
            IssueDate: '2025-08-15',
            DueDate: '2025-10-15',
            Attachment: '',
            Note: 'Test Invoice',
            DocumentStatus: 1,
            ProcessingStatus: 1,
            PaymentStatus: 1,
            TaxID: 'RS123456789',
            serviceItems: [
                {
                    ServiceType: 'Transportation',
                    Route: 'Olesnica - Subtoica',
                    Price: 100000,
                    TruckID: 1,
                    TrailerID: 2,
                    RegTag: null,
                    Name: null,
                    Discount: null,
                    VATCode: 'S20',
                    VATExamptionCode: 'None'
                }
            ]
        };
       const res = await request(app)
      .post('/admin/outInvoice/insert')
      .set('Content-Type', 'application/json') // eksplicitno, mada i nije neophodno
      .send(invoicePayload);
      expect(res.statusCode).to.equal(302); // očekujemo redirect ako insert prođe
  });

  it('POST /admin/outInvoice/insert should insert outgoing invoice with an outsorcing service item', async function () {
        const invoicePayload = {
            OutInvoiceNmbr: 'MOCHATEST-100',
            Currency: 'RSD',
            ReferenceNmbr: 'REF-01',
            OrderNmbr: 'ORD-001',
            TransDate: '2025-08-15',
            IssueDate: '2025-08-15',
            DueDate: '2025-10-15',
            Attachment: '',
            Note: 'Test Invoice',
            DocumentStatus: 1,
            ProcessingStatus: 1,
            PaymentStatus: 1,
            TaxID: 'RS123456789',
            serviceItems: [
                {
                    ServiceType: 'Outsorcing',
                    Route: 'Olesnica - Subtoica',
                    Price: 100000,
                    TruckID: null,
                    TrailerID: null,
                    RegTag: 'SU 650-GH/AE-878 SU',
                    Name: null,
                    Discount: null,
                    VATCode: 'S20',
                    VATExamptionCode: 'None'
                }
            ]
        };
      const res = await request(app)
      .post('/admin/outInvoice/insert')
      .set('Content-Type', 'application/json') // eksplicitno, mada i nije neophodno
      .send(invoicePayload);
      expect(res.statusCode).to.equal(302); // očekujemo redirect ako insert prođe
  });
  
});
