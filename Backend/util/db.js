const sql = require('mssql/msnodesqlv8');


const config = {
    server: '(localdb)\\MSSQLLocalDB',
    database: 'AtlantisIS',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

module.exports = {
    sql,
    config
};