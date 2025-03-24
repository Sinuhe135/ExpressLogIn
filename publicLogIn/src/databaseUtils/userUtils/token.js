const pool = require('../databaseCon.js');

async function createToken(token,id)
{
    const [result] = await pool.query('insert into TOKEN (id,token) values (?,?)',[id,token]);
    return result.insertId;
}

async function getToken(id)
{
    const [rows] = await pool.query('select id, token, UNIX_TIMESTAMP(date) from TOKEN where id = ?',[id]);
    return rows[0];
}

module.exports={createToken, getToken}