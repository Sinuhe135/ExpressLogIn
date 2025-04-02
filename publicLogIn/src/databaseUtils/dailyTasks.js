const {getRefreshMaxAgeMili} = require('../jsonWebToken/utils.js');
const {deleteExpiredSessions} = require('./userUtils/session.js');
const {} = require('./userUtils/user.js');

// const interval = 1*(24*60*60*1000); //days
const interval = 5*(60*1000); //days

async function deleteExpiredAuthSession()
{
    const maxAge = getRefreshMaxAgeMili()/1000;
    try {
        const result = await deleteExpiredSessions(maxAge);
        console.log(`\nSesiones eliminadas: ${result.affectedRows}`);
    } 
    catch (error) {
        console.log(`\nHubo un problema al eliminar las sesiones`);
        console.log(error);
    }
}

async function deleteExpiredUnverifiedUsers() {

}

module.exports = () =>{
    setInterval(async () => {
        //await deleteExpiredAuthSession();
        await deleteExpiredUnverifiedUsers();
    }, interval);
};