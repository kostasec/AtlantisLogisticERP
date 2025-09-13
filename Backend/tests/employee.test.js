const request = require('supertest');
const express = require('express');
const { expect } = require('chai');
const employeeRouter = require('../routes/employee');

const app = express();
app.set('view engine', 'ejs');
app.set('views',__dirname + '/../views');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/employee', employeeRouter);

describe('Employee routes',()=>{
    it('GET /employee/read should return 200', async ()=>{
        const res = await request(app).get('/employee/read');
        expect(res.statusCode).to.equal(200);
    });

    
    it('GET /employee/insert should return 200', async()=>{
        const res = await request(app).get('/employee/insert');
        expect(res.statusCode).to.equal(200);
    });

    
    it('POST /employee/insert should handle missing data', async () => {
        const res = await request(app)
        .post('/employee/insert')
        .send({}); //empty body
      expect(res.statusCode).to.equal(500); //we're expecting error due to empty body
    });


    it('POST /employee/insert should create employee with valid data', async()=>{
        const res = await request(app)
        .post('/employee/insert')
        .send({
            EmplType: 'Driver',
            FirstName: 'Milan',
            LastName: 'Markovic',
            StreetAndNmbr: 'Suboticka BB',
            City: 'Subotica',
            ZIPCode: '24000',
            Country: 'Srbija',
            PhoneNmbr: '0615231444',
            EmailAdress: 'milan@markovic',
            IDCardNmbr: '5666200',
            PassportNmbr: '45454545',
            MgrID: 1 
        });
        expect(res.statusCode).to.equal(302);
    });


});