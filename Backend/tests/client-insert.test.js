const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // putanja do tvog express app-a

describe('Client Insert API', () => {
    it('should insert client without contact person', async () => {
        const res = await request(app)
            .post('/admin/client/insert')
            .type('form')
            .send({
                TaxID: 'TEST123',
                RegNmbr: 'REG123',
                ClientName: 'Test Client',
                StreetAndNmbr: 'Test St 1',
                City: 'TestCity',
                ZIP: '12345',
                Country: 'TestCountry',
                Email: 'testclient@example.com'
            });
        expect(res.statusCode).to.equal(302); // redirect
    });

    it('should insert client with multiple contact persons', async () => {
        const res = await request(app)
            .post('/admin/client/insert')
            .type('form')
            .send({
                TaxID: 'TEST456',
                RegNmbr: 'REG456',
                ClientName: 'Test Client 2',
                StreetAndNmbr: 'Test St 2',
                City: 'TestCity2',
                ZIP: '54321',
                Country: 'TestCountry2',
                Email: 'testclient2@example.com',
                'ContactName[]': ['Person One', 'Person Two'],
                'Description[]': ['Desc1', 'Desc2'],
                'PhoneNmbr[]': ['111', '222'],
                'PersonEmail[]': ['one@example.com', 'two@example.com']
            });
        expect(res.statusCode).to.equal(302); // redirect
    });
});
