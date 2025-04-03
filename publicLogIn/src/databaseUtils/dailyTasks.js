const {getRefreshMaxAgeMili} = require('../jsonWebToken/utils.js');
const {deleteExpiredSessions} = require('./userUtils/session.js');
const {getAllUnverifiedExpiredUsers, deleteUnverifiedUser} = require('./userUtils/user.js');
const {getVerificationExpirationTimeMili} = require('./../utils/verification.js');

const interval = 1*(24*60*60*1000); //days
// const interval = (30*1000); //days

async function deleteExpiredAuthSession()
{
    try {
        const maxAge = getRefreshMaxAgeMili()/1000;

        const result = await deleteExpiredSessions(maxAge);
        console.log(`\nSesiones eliminadas: ${result.affectedRows}`);
    } 
    catch (error) {
        console.log(`\nHubo un problema al eliminar las sesiones`);
        console.log(error);
    }
}

async function deleteExpiredUnverifiedUsers() {
    try {
        const verificationTimeLimit = getVerificationExpirationTimeMili() / 1000;

        const expiredUsers = await getAllUnverifiedExpiredUsers(verificationTimeLimit);

        console.log('Eliminando '+expiredUsers.length+' usuarios sin verificar');

        expiredUsers.forEach(async (user)=>{
            await deleteUnverifiedUser(user.id);
        });
        
    } catch (error) {
        console.log(`\nHubo un problema al eliminar los usuarios sin verificar`);
        console.log(error);
    }
}

module.exports = () =>{
    setInterval(async () => {
        await deleteExpiredAuthSession();
        await deleteExpiredUnverifiedUsers();
    }, interval);
};