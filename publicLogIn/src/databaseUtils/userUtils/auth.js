const pool = require('../databaseCon.js');

async function getAuth(id)
{
    const [rows] = await pool.query('select id,email from AUTH where id = ?',[id]);
    return rows[0];
}

async function getAuthByEmail(email)
{
    const [rows] = await pool.query('select * from AUTH where email = ?',[email]);
    return rows[0]; 
}

async function checkAuthEmail(email)
{
    const [rows] = await pool.query('select AUTH.id, AUTH.email, USER.status from AUTH left join USER on USER.id = AUTH.id where AUTH.email = ?',[email]);
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

        return await idAuth;
    } catch (error) {
        await conn.rollback();
        conn.release();

        throw (error);
    }   
}

module.exports={getAuthByEmail, getAuth, editPassword,checkAuthEmail};