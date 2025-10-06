const { sql, getPool } = require('../util/db');

class IncInvoice {

    static async fetchIncInvCarrier() {
        const pool = await getPool();
        return pool.request().query(`
        SELECT 
        *
        FROM vw_IncInvSenderCarrier
        `);
}

    static async fetchIncInvOther(){
        const pool = await getPool();
        return pool.request().query(`
        SELECT 
        *
        FROM vw_IncInvSenderOther
        `);
}

    static async fetchAllIncInv(){
        const pool = await getPool();
        return pool.request().query(`
        SELECT 
        *
        FROM vw_IncInv
        `);
    }


}

module.exports = IncInvoice;