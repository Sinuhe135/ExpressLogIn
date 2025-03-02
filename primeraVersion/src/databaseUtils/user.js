const pool = require('./databaseCon.js');

async function getAllUsers()
{
    const [rows] = await pool.query('select * from USER');
    return rows;
}

async function getUser(id)
{
    const [rows] = await pool.query('select * from USER where id = ?',[id]);
    return rows[0];
}

async function createUser(name, active)
{
    const [result] = await pool.query('insert into USER (name,active) values (?,?)',[name,active]);
    return await getUser(result.insertId);
}

async function deleteUser(id)
{
    const deletedUser = await getUser(id);
    const [result] = await pool.query('delete from USER where id = ?',[id]);
    return deletedUser;
}

async function editUser(name,active,id)
{
    const [result] = await pool.query('update USER set name = ?, active = ? where id = ?',[name,active,id]);
    return await getUser(id);
}

module.exports={getAllUsers,getUser,deleteUser,editUser,createUser};