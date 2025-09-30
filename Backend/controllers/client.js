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

    // Provjeri da li je zahtjev za API (JSON)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      // Transformiraj podatke za frontend format
      const transformedClients = clients.map(client => ({
        id: client.TaxID,
        taxId: client.TaxID,
        clientName: client.ClientName,
        regNmbr: client.RegNmbr,
        adress: `${client.StreetAndNmbr}, ${client.City} ${client.ZIP}, ${client.Country}`,
        email: client.Email,
        contacts: client.Contacts.map(contact => ({
          contactPersonID: contact.ContactPersonID,
          name: contact.ContactName,
          description: contact.Description,
          phoneNumber: contact.PhoneNmbr,
          email: contact.PersonEmail
        })),
        contactPerson: client.Contacts.length > 0 ? {
          name: client.Contacts[0].ContactName,
          description: client.Contacts[0].Description,
          phoneNumber: client.Contacts[0].PhoneNmbr,
          email: client.Contacts[0].PersonEmail
        } : null
      }));

      return res.json({
        success: true,
        data: transformedClients
      });
    }

    // Inače vrati HTML stranicu
    res.render('client/read-client', {
      pageTitle: 'All Clients',
      path: '/client/read',
      clients
    });

  } catch (err) {
    console.error('Error fetching clients:', err);
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

// API endpoint za frontend
exports.getClientsAPI = async (req, res, next) => {
  try {
    const result = await Client.fetchAll();
    const rows = result.recordset;

    const clientMap = {};
    rows.forEach(row => {
      if (!clientMap[row.TaxID]) {
        clientMap[row.TaxID] = {
          id: row.TaxID,
          taxId: row.TaxID,
          clientName: row.ClientName,
          regNmbr: row.RegNmbr,
          adress: `${row.StreetAndNmbr}, ${row.City} ${row.ZIP}, ${row.Country}`,
          email: row.Email,
          contacts: []
        };
      }

      if (row.ContactPersonID) {
        clientMap[row.TaxID].contacts.push({
          contactPersonID: row.ContactPersonID,
          name: row.ContactName,
          description: row.Description,
          phoneNumber: row.PhoneNmbr,
          email: row.PersonEmail
        });
      }
    });

    const clients = Object.values(clientMap);
    
    // Dodajemo contactPerson kao prvi kontakt ako postoji
    clients.forEach(client => {
      if (client.contacts.length > 0) {
        client.contactPerson = client.contacts[0];
      }
    });

    res.json({
      success: true,
      data: clients
    });

  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({
      success: false,
      message: 'Database Error'
    });
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