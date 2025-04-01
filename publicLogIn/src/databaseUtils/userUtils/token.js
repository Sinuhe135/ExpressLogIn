const pool = require('../databaseCon.js');

async function getToken(id)
{
    const [rows] = await pool.query('select id, token, UNIX_TIMESTAMP(date) as date from TOKEN where id = ?',[id]);
    return rows[0];
}

async function replaceToken(id, token)
{
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
    
        await pool.query('delete from TOKEN where id = ?',[id]);
        await conn.query('insert into TOKEN (id,token) values (?,?)',[id,token]);
    
        await conn.commit();
        conn.release();

        return id;
    } catch (error) {
        await conn.rollback();
        conn.release();

        throw (error);
    }    
}

module.exports={getToken,replaceToken}