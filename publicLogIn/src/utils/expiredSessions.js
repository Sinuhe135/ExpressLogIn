const {getRefreshMaxAgeMili} = require('./../jsonWebToken/utils.js');
const {deleteExpiredSessions} = require('./../databaseUtils/userUtils/session.js');

const maxAge = getRefreshMaxAgeMili()/1000;
const interval = 1*(24*60*60*1000); //days

module.exports = () =>{
    setInterval(async () => {
        try {
            const result = await deleteExpiredSessions(maxAge);
            console.log(`\nSesiones eliminadas: ${result.affectedRows}`);
        } 
        catch (error) {
            console.log(`\nHubo un problema al eliminar las sesiones`);
            console.log(error);
        }
    }, interval);
};