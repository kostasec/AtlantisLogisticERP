//controllers/Client.js
const { sql, getPool } = require('../util/db');
const Client = require('../models/Client');


exports.getReadClient = async (req, res, next) => {
  try {
    const result = await Client.fetchAll();
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
      path: '/client/read',
      clients
    });

  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).send('Database Error');
  }
};


exports.postUpsertClient = async (req, res, next) =>{
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try{
    await transaction.begin();
    await Client.upsert(req.body, transaction);
    await transaction.commit();
    res.redirect('/client/read');

    } catch (err) {
    await transaction.rollback();

    if (err.number === 2627) {
    console.error('Duplicate RegNmbr:', err);
    return res.status(400).send('RegNmbr already exists for another client.');
    }

  console.error('Error upserting client:', err);
  res.status(500).send('Database Error');

  }

}


exports.getInsertClient = (req, res, next) => {
  res.render('client/upsert-client', {
    pageTitle: 'Create New Client',
    client: {},
    contacts: []
  });
};


exports.getUpdateClient = async (req, res, next) => {
  const taxId = req.params.taxId.trim();
  const pool = await getPool();
  
  try {
    const clientRes = await Client.findClientByTaxId(taxId);
    const contactRes = await Client.findContactsByTaxId(taxId);
    if (clientRes.recordset.length === 0) {
      return res.status(404).send('Client not found');
    }
    res.render('client/upsert-client', {
      pageTitle: 'Edit Client',
      client: clientRes.recordset[0],
      contacts: contactRes.recordset
    });
  } catch (err) {
    console.error('Error loading client for edit:', err);
    res.status(500).send('Database Error');
  }
};


exports.postDeleteClient = async (req, res, next) => {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

    try {
    await transaction.begin();
    await Client.deleteClient(req.params.id,transaction);
    await Client.deleteContact(req.params.id, transaction);
    await transaction.commit();
    console.log('Client deleted successfully.')
    res.redirect('/client/read')

    } catch (err) {
    if (transaction && transaction._aborted !== true) {
      await transaction.rollback();
    }
    console.error('Error deleting client:', err);
    res.status(500).send('Database error');
  }
};


exports.postDeleteClientContact = async (req, res, next) => {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    await Client.deleteContact(req.params.id, transaction);
    await transaction.commit();
    console.log('Client deleted successfully.')
    res.redirect('/client/read')

  } catch (err) {
    console.error('Error deleting contact person:', err);
    res.status(500).send('Database error');
  }
};