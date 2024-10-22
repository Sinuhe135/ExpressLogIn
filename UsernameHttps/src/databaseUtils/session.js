const pool = require('./databaseCon.js');

async function getAllAuth()
{
    const [rows] = await pool.query('select * from AUTH');
    return rows;
}

async function getSession(id)
{
    const [rows] = await pool.query('select id, idAuth, UNIX_TIMESTAMP(startDate) as startDate from SESSION where id = ?',[id]);
    return rows[0];
}

async function createSession(idAuth)
{
    const [result] = await pool.query('insert into SESSION (idAuth) values (?)',[idAuth]);
    return await getSession(result.insertId);
}

async function getSessionByIdUser(idAuth)
{
    const [rows] = await pool.query('select * from SESSION where idAuth = ?',[idAuth]);
    return rows[0]; 
}

async function deleteSession(id)
{
    const deletedSession = await getSession(id);
    const [result] = await pool.query('delete from SESSION where id = ?',[id]);
    return deletedSession;
}

async function deleteExpiredSessions(maxAge)
{
    const [result] = await pool.query('delete from SESSION where UNIX_TIMESTAMP(current_timestamp) - UNIX_TIMESTAMP(startDate) > ?',[maxAge]);
    return result;
}

async function updateStartDate(id)
{
    const [result] = await pool.query('update SESSION set startDate = current_timestamp where id = ?',[id]);
    return getSession(id);
}

async function editAuth(username,password,id)
{
    const [result] = await pool.query('update AUTH set username = ?, password = ? where id = ?',[username,password,id]);
    return getSession(id);
}

module.exports={getSession,createSession,getSessionByIdUser, deleteSession, updateStartDate,deleteExpiredSessions};