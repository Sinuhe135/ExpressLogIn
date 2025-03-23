const pool = require('../databaseCon.js');

async function createToken(token,userId)
{
    const [result] = await pool.query('insert into TOKEN (token,idUser) values (?,?)',[token, userId]);
    return result.insertId;
}

async function getToken(token, userId)
{
    const [rows] = await pool.query('select id, idUser, token,  from USER left join AUTH on USER.id = AUTH.id where USER.active = active and USER.id = ?',[id]);
    return rows[0];
}

module.exports={createToken, getToken}