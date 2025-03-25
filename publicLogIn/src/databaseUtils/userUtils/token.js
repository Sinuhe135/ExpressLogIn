const pool = require('../databaseCon.js');

async function getToken(id)
{
    const [rows] = await pool.query('select id, token, UNIX_TIMESTAMP(date) as date from TOKEN where id = ?',[id]);
    return rows[0];
}

module.exports={getToken}