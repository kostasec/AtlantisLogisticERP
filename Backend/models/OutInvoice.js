const { sql, getPool } = require('../util/db');

class OutInvoice {
    static async fetchAll() {
        const pool = await getPool();
        return pool.request().query(`
            SELECT * FROM vw_OutInvoiceBackend
        `);
    }
}

module.exports = OutInvoice;