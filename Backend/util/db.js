const sql = require('mssql/msnodesqlv8');


const config = {
    server: '(localdb)\\MSSQLLocalDB',
    database: 'AtlantisIS',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

let poolPromise;
try {
  poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      console.log('Connected to SQL Server');
      return pool;
    })
    .catch(err => {
      console.error('Database Connection Failed!', err);
      throw err;
    });
} catch (err) {
  console.error('SQL Server connection error:', err);
}

module.exports = {
  sql,
  getPool: () => poolPromise
};