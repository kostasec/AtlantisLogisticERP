const request = require('supertest');
const express = require('express');
const { expect } = require('chai');
const clientRouter = require('../routes/client');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/client', clientRouter);

describe('Client routes', () => {

  it('GET /client/read should return 200', async () => {
    const res = await request(app).get('/client/read');
    expect(res.statusCode).to.equal(200);
  });

  
  it('GET /client/update should return 200', async () =>{
    const res = await request(app).get('/client/update/RS123456789')
    expect(res.statusCode).to.equal(200);
  } )


  it('POST /client/upsert should handle missing data', async () => {
    const res = await request(app)
      .post('/client/upsert')
      .send({}); // empty body
    expect(res.statusCode).to.equal(500); //we're expecting error due to empty body
    });


  it('POST /client/upsert should create client with valid data', async () => {
    const res = await request(app)
      .post('/client/upsert')
      .send({
        TaxID: 'BACKEST1236545',
        RegNmbr: null,
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
    expect(res.statusCode).to.equal(302); // Očekujemo redirect na /client/read
  });


  it('POST /client/upsert should create client without contactperson', async () => {
    const res = await request(app)
      .post('/client/upsert')
      .send({
        TaxID: 'MBTESTNOCP1233',
        RegNmbr: 'REGBNOCP1233',
        ClientName: 'No Contact Client',
        StreetAndNmbr: 'NoContact St 1',
        City: 'NoContactCity',
        ZIP: '54321',
        Country: 'NoContactCountry',
        Email: 'nocontact@example.com',
        contacts: [] // Nema kontakata
      });
    expect(res.statusCode).to.equal(302); // Očekujemo redirect na /client/read
  });


  it('POST /client/delete/:id should delete client', async () => {
  const res = await request(app)
    .post('/client/delete/HU400') // konkretna vrednost umesto :id
    .send();
  expect(res.statusCode).to.equal(302);
  });
  

  it('POST /client/contact/delete/:id should delete contactPerson', async()=>{
    const res = await request(app)
    .post('/client/contact/delete/17')
    .send({taxId: 'HU10'});

   expect(res.statusCode).to.equal(302);
  });
  
});
