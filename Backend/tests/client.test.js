const request = require('supertest');
const express = require('express');
const { expect } = require('chai');
const clientRouter = require('../routes/admin/client');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/admin/client', clientRouter);

describe('Client routes', () => {
  it('GET /admin/client/read should return 200', async () => {
    const res = await request(app).get('/admin/client/read');
    expect(res.statusCode).to.equal(200);
  });

  it('GET /admin/client/insert should return 200', async () => {
    const res = await request(app).get('/admin/client/insert');
    expect(res.statusCode).to.equal(200);
  });

  it('POST /admin/client/upsert should handle missing data', async () => {
    const res = await request(app)
      .post('/admin/client/upsert')
      .send({}); // empty body
    expect(res.statusCode).to.equal(500); //we're expecting error due to empty body
    });


  it('POST /admin/client/upsert should create client with valid data', async () => {
    const res = await request(app)
      .post('/admin/client/upsert')
      .send({
        TaxID: 'TEST1236545',
        RegNmbr: 'REG5123',
        ClientName: 'Test Client',
        StreetAndNmbr: 'Test Street 1',
        City: 'TestCity',
        ZIP: '12345',
        Country: 'TestCountry',
        Email: 'test@example.com',
        contacts: [
          {
            ContactName: 'Contact Person',
            Description: 'Main contact',
            PhoneNmbr: '123456789',
            PersonEmail: 'contact@example.com'
          }
        ]
      });
    expect(res.statusCode).to.equal(302); // Očekujemo redirect na /admin/client/read
  });

  it('POST /admin/client/upsert should create client without contactperson', async () => {
    const res = await request(app)
      .post('/admin/client/upsert')
      .send({
        TaxID: 'TESTNOCP123',
        RegNmbr: 'REGNOCP123',
        ClientName: 'No Contact Client',
        StreetAndNmbr: 'NoContact St 1',
        City: 'NoContactCity',
        ZIP: '54321',
        Country: 'NoContactCountry',
        Email: 'nocontact@example.com',
        contacts: [] // Nema kontakata
      });
    expect(res.statusCode).to.equal(302); // Očekujemo redirect na /admin/client/read
  });

  
});
