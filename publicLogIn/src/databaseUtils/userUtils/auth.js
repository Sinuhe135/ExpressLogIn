const pool = require('../databaseCon.js');

async function getAuth(id)
{
    const [rows] = await pool.query('select id,username from AUTH where id = ?',[id]);
    return rows[0];
}

async function getAuthByUsername(username)
{
    const [rows] = await pool.query('select * from AUTH where username = ?',[username]);
    return rows[0]; 
}

async function editPassword(password,idAuth,idCurrentSession)
{
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
    
        const [result] = await pool.query('update AUTH set password = ? where id = ?',[password,idAuth]);
        await pool.query('delete from SESSION where idAuth = ? and id != ?',[idAuth,idCurrentSession]); //deletes all user sessions except current one
    
        await conn.commit();
        conn.release();

        return await getAuth(idAuth);
    } catch (error) {
        await conn.rollback();
        conn.release();

        throw (error);
    }   
}

module.exports={getAuthByUsername, getAuth, editPassword};