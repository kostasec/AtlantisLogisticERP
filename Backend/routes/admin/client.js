const express = require('express');
const router = express.Router();
const { sql, config } = require('../../util/db');


// GET /admin/client/read
router.get('/read', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('dbo.sp_ReadClientsWithContacts');
    const rows = result.recordset;

    const clientMap = {};
    rows.forEach(row => {
      if (!clientMap[row.TaxID]) {
        clientMap[row.TaxID] = {
          TaxID: row.TaxID,
          ClientName: row.ClientName,
          RegNmbr: row.RegNmbr,
          StreetAndNmbr: row.StreetAndNmbr,
          City: row.City,
          ZIP: row.ZIP,
          Country: row.Country,
          Email: row.Email,
          Contacts: []
        };
      }

      if (row.ContactPersonID) {
        clientMap[row.TaxID].Contacts.push({
          ContactPersonID: row.ContactPersonID,
          ContactName: row.ContactName,
          Description: row.Description,
          PhoneNmbr: row.PhoneNmbr,
          PersonEmail: row.PersonEmail
        });
      }
    });

    const clients = Object.values(clientMap);

    res.render('client/read-client', {
      pageTitle: 'All Clients',
      path: '/admin/client/read',
      clients
    });

  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).send('Database Error');
  }
});



// GET /admin/client/insert
router.get('/insert', (req, res) => {
  res.render('client/upsert-client', {
    pageTitle: 'Create New Client',
    client: {},
    contacts: [{}]
  });
});


// GET /admin/client/update/:taxId
router.get('/update/:taxId', async (req, res) => {
  const taxId = req.params.taxId.trim();
  

  try {
    const pool = await sql.connect(config);

    const clientRes = await pool.request()
      .input('taxId', sql.VarChar(50), taxId)
      .query(`SELECT * FROM dbo.Client WHERE TaxID = @taxId`);

    const contactsRes = await pool.request()
      .input('taxId', sql.VarChar(50), taxId)
      .query(`SELECT * FROM dbo.ContactPerson WHERE TaxID = @taxId`);

    if (clientRes.recordset.length === 0) {
      return res.status(404).send('Client not found');
    }

    res.render('client/upsert-client', {
      pageTitle: 'Edit Client',
      client: clientRes.recordset[0],
      contacts: contactsRes.recordset
    });
  } catch (err) {
    console.error('Error loading client for edit:', err);
    res.status(500).send('Error');
  }
});



// POST /admin/client/upsert
router.post('/upsert', async (req, res) => {

  let {
    TaxID,
    RegNmbr,
    ClientName,
    StreetAndNmbr,
    City,
    ZIP,
    Country,
    Email,
    contacts = []
  } = req.body;



  try {
    const pool = await sql.connect(config);

    const contactTable = new sql.Table('dbo.ContactPersonTvpType');
    contactTable.columns.add('ContactPersonID', sql.Int);
    contactTable.columns.add('ContactName', sql.VarChar(100));
    contactTable.columns.add('Description', sql.VarChar(200));
    contactTable.columns.add('PhoneNmbr', sql.VarChar(50));
    contactTable.columns.add('PersonEmail', sql.VarChar(100));

    contacts.forEach(c => {
    contactTable.rows.add(
    (c.ContactPersonID !== undefined && c.ContactPersonID !== '' && c.ContactPersonID !== null) ? parseInt(c.ContactPersonID) : null,
    c.ContactName,
    c.Description || null,
    c.PhoneNmbr || null,
    c.PersonEmail || null
  );
});


    await pool.request()
      .input('TaxID', sql.VarChar(50), TaxID)
      .input('RegNmbr', sql.VarChar(30), RegNmbr)
      .input('ClientName', sql.VarChar(100), ClientName)
      .input('StreetAndNmbr', sql.VarChar(100), StreetAndNmbr)
      .input('City', sql.VarChar(50), City)
      .input('ZIP', sql.VarChar(10), ZIP)
      .input('Country', sql.VarChar(50), Country)
      .input('Email', sql.VarChar(100), Email)
      .input('ContactPersons', contactTable)
      .execute('dbo.sp_UpsertClientWithContacts');

    res.redirect('/admin/client/read');
  } catch (err) {
    console.error('Error upserting client:', err);
    res.status(500).send('Database Error');
  }
});

// POST /admin/client/delete/:id
router.post('/delete/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
    await pool.request()
      .input('TaxID', sql.VarChar(50), req.params.id)
      .query("UPDATE Client SET IsActive = 0 WHERE TaxID = @TaxID");
        res.redirect('/admin/client/read');
    } catch (err) {
        console.error('Error deleting client', err);
        res.status(500).send('Database error');
    }
});

// POST /admin/client/contact/delete/:id
router.post('/contact/delete/:id', async (req, res) => {
  const contactId = req.params.id;
  const taxId = req.body.taxId;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('ContactPersonID', sql.Int, contactId)
      .query('DELETE FROM dbo.ContactPerson WHERE ContactPersonID = @ContactPersonID');
    res.redirect(`/admin/client/update/${taxId}`);
  } catch (err) {
    console.error('Error deleting contact person:', err);
    res.status(500).send('Database error');
  }
});


module.exports = router;