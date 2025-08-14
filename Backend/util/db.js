const sql = require('mssql/msnodesqlv8');


const config = {
    server: '(localdb)\\MSSQLLocalDB',
    database: 'AtlantisIS',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

// Funkcija za dobijanje konekcije sa bazom
async function getPool() {
    return await sql.connect(config);
}

module.exports = {
    sql,
    getPool,
    config
};