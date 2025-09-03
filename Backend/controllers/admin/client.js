const { sql, getPool } = require('../../util/db');

exports.getReadClient = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM vw_ClientWithContacts');
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
};


exports.postUpsertClient = async (req, res, next) => {
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

  
  const regNmbrValue = RegNmbr && RegNmbr.trim() !== '' ? RegNmbr.trim() : null;

  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 1.) UPSERT Client
    const clientExists = await new sql.Request(transaction)
      .input('TaxID', sql.VarChar(50), TaxID)
      .query('SELECT COUNT(1) AS Cnt FROM dbo.Client WHERE TaxID = @TaxID');

    if (clientExists.recordset[0].Cnt > 0) {
      // UPDATE
      await new sql.Request(transaction)
        .input('TaxID', sql.VarChar(50), TaxID)
        .input('RegNmbr', sql.VarChar(30), regNmbrValue)
        .input('ClientName', sql.VarChar(100), ClientName)
        .input('StreetAndNmbr', sql.VarChar(100), StreetAndNmbr)
        .input('City', sql.VarChar(50), City)
        .input('ZIP', sql.VarChar(10), ZIP)
        .input('Country', sql.VarChar(50), Country)
        .input('Email', sql.VarChar(100), Email)
        .query(`
          UPDATE dbo.Client
          SET RegNmbr = @RegNmbr,
              ClientName = @ClientName,
              StreetAndNmbr = @StreetAndNmbr,
              City = @City,
              ZIP = @ZIP,
              Country = @Country,
              Email = @Email,
              IsActive = 1
          WHERE TaxID = @TaxID
        `);
    } else {
      // INSERT
      await new sql.Request(transaction)
        .input('TaxID', sql.VarChar(50), TaxID)
        .input('RegNmbr', sql.VarChar(30), regNmbrValue || null)
        .input('ClientName', sql.VarChar(100), ClientName)
        .input('StreetAndNmbr', sql.VarChar(100), StreetAndNmbr)
        .input('City', sql.VarChar(50), City)
        .input('ZIP', sql.VarChar(10), ZIP)
        .input('Country', sql.VarChar(50), Country)
        .input('Email', sql.VarChar(100), Email)
        .query(`
          INSERT INTO dbo.Client (TaxID, RegNmbr, ClientName, StreetAndNmbr, City, ZIP, Country, Email, IsActive)
          VALUES (@TaxID, @RegNmbr, @ClientName, @StreetAndNmbr, @City, @ZIP, @Country, @Email, 1)
        `);
    }

    // 2.) Contacts
    for (const c of contacts) {
      if (c.ContactPersonID) {
        // UPDATE postojećeg kontakta
        await new sql.Request(transaction)
          .input('ContactPersonID', sql.Int, parseInt(c.ContactPersonID))
          .input('ContactName', sql.VarChar(100), c.ContactName)
          .input('Description', sql.VarChar(200), c.Description || null)
          .input('PhoneNmbr', sql.VarChar(50), c.PhoneNmbr || null)
          .input('PersonEmail', sql.VarChar(100), c.PersonEmail || null)
          .input('TaxID', sql.VarChar(50), TaxID)
          .query(`
            UPDATE dbo.ContactPerson
            SET ContactName = @ContactName,
                [Description] = @Description,
                PhoneNmbr = @PhoneNmbr,
                PersonEmail = @PersonEmail
            WHERE ContactPersonID = @ContactPersonID AND TaxID = @TaxID
          `);
      } else {
        // INSERT novog kontakta
        await new sql.Request(transaction)
          .input('TaxID', sql.VarChar(50), TaxID)
          .input('ContactName', sql.VarChar(100), c.ContactName)
          .input('Description', sql.VarChar(200), c.Description || null)
          .input('PhoneNmbr', sql.VarChar(50), c.PhoneNmbr || null)
          .input('PersonEmail', sql.VarChar(100), c.PersonEmail || null)
          .query(`
            INSERT INTO dbo.ContactPerson (TaxID, ContactName, [Description], PhoneNmbr, PersonEmail)
            VALUES (@TaxID, @ContactName, @Description, @PhoneNmbr, @PersonEmail)
          `);
      }
    }

    await transaction.commit();
    res.redirect('/admin/client/read');
    } catch (err) {
    await transaction.rollback();

    if (err.number === 2627) {
    console.error('Duplicate RegNmbr:', err);
    return res.status(400).send('RegNmbr already exists for another client.');
    }

  console.error('Error upserting client:', err);
  res.status(500).send('Database Error');
}

};


exports.getInsertClient = (req, res, next) => {
  res.render('client/upsert-client', {
    pageTitle: 'Create New Client',
    client: {},
    contacts: []
  });
};

exports.getUpdateClient = async (req, res, next) => {
  const taxId = req.params.taxId.trim();

  try {
    const pool = await getPool();

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
};

exports.postDeleteClient = async (req, res, next) => {
    try {
    const pool = await getPool();
    await pool.request()
      .input('TaxID', sql.VarChar(50), req.params.id)
      .query("UPDATE Client SET IsActive = 0 WHERE TaxID = @TaxID");
        res.redirect('/admin/client/read');
    } catch (err) {
        console.error('Error deleting client', err);
        res.status(500).send('Database error');
    }
};

exports.postDeleteClientContact = async (req, res, next) => {
  const contactId = req.params.id;
  const taxId = req.body.taxId;
  try {
    const pool = await getPool();
    await pool.request()
      .input('ContactPersonID', sql.Int, contactId)
      .query('DELETE FROM dbo.ContactPerson WHERE ContactPersonID = @ContactPersonID');
    res.redirect(`/admin/client/update/${taxId}`);
  } catch (err) {
    console.error('Error deleting contact person:', err);
    res.status(500).send('Database error');
  }
};