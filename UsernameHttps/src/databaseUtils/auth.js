const pool = require('./databaseCon.js');

async function getAllAuth()
{
    const [rows] = await pool.query('select * from AUTH');
    return rows;
}

async function getAuth(id)
{
    const [rows] = await pool.query('select * from AUTH where id = ?',[id]);
    return rows[0];
}

async function createAuth(id,username,password)
{
    await pool.query('insert into AUTH (id,username,password) values (?,?,?)',[id,username,password]);
    return getAuth(id);
}

async function getAuthByUsername(username)
{
    const [rows] = await pool.query('select * from AUTH where username = ?',[username]);
    return rows[0]; 
}

async function deleteAuth(id)
{
    const deletedAuth = await getAuth(id);
    const [result] = await pool.query('delete from AUTH where id = ?',[id]);
    return deletedAuth;
}

async function editAuth(username,password,id)
{
    const [result] = await pool.query('update AUTH set username = ?, password = ? where id = ?',[username,password,id]);
    return getAuth(id);
}

module.exports={createAuth,getAuthByUsername, getAuth};