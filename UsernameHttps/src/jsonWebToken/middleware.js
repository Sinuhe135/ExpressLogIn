const jwt = require('jsonwebtoken');
const {getKey, getRefreshMaxAgeMili,generateAccessToken,generateRefreshToken} = require('./utils.js');
const response = require('./../utils/responses.js');
const {getSession, updateStartDate} = require('./../databaseUtils/session.js');
const {getAuth} = require('./../databaseUtils/auth.js');

const getAuthInfo = async (req,res,next) =>{
    try {
        const logInSuccess = await checkAccessToken(res,req)
        if (!logInSuccess)
        {
            response.error(req,res,"Sesion no iniciada",403);
            return;
        }

        return next();

    } catch (error) {
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
};


const getSessionInfo = async (req,res,next) =>{
    try {
        const logInSuccess = await checkRefreshToken(res,req, false)
        if (!logInSuccess)
            {
                response.error(req,res,"Sesion no iniciada",403);
            return;
        }
        
        return next();

    } catch (error) {
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
};

const requireNotLoggedIn = async (req,res,next) =>{
    try {
        const logInSuccess = await checkAccessToken(res,req)
        if (logInSuccess)
        {
            response.error(req,res,"Sesion ya iniciada",403);
            return;
        }

        return next();

    } catch (error) {
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
};

async function checkAccessToken(res,req)
{
    const accessToken = req.cookies.accessToken;

    if(!accessToken)
        return false;

    const {payload, expired} = verifyJWT(accessToken);
    
    if(expired)
        return await checkRefreshToken(res,req, true);

    if(!payload)
        return false;

    res.locals.idAuth = payload.id;
    return true;
}
    
async function checkRefreshToken(res,req, isRevalidating)
{
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken)
        return false;

    const {payload, expired} = verifyJWT(refreshToken);

    if(expired)
        return false;
    
    if(!payload)
        return false;
    
    const session = await getSession(payload.id);
    
    if(!session)
        return false;

    if(session.idAuth !== payload.idAuth)
        return false;

    if(isRevalidating)
        return await updateAccessToken(res, session);
    else
    {
        res.locals.idSession = session.id;
        return true;
    }
}
                
function verifyJWT(token)
{
    try {
        const decoded = jwt.verify(token,getKey());
        return {payload: decoded,expired: false};
        
    } catch (error) {
        if(error.name === 'TokenExpiredError')
        {
            return {payload:null,expired:true}
        }
        else
        {
            return {payload:null,expired:false}
        }
    }
}

async function updateAccessToken(res, session)
{
    const auth = await getAuth(session.idAuth)
    if (!auth)
        return false;
    
    const accessToken = generateAccessToken(auth);
    res.cookie('accessToken',accessToken,{httpOnly:true,maxAge:getRefreshMaxAgeMili()});

    await updateRefreshToken(res, session);
    
    res.locals.idAuth = auth.id;
    return true;
}

async function updateRefreshToken(res,session)
{
    //Checks if refreshToken is half the way to expiring 
    if ( getRefreshMaxAgeMili()/2 < Date.now()-session.startDate*1000 )
    {
        const updatedSession = await updateStartDate(session.id);
        const refreshToken = generateRefreshToken(updatedSession);
        res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge:getRefreshMaxAgeMili()});
    }
}

module.exports = {getAuthInfo, getSessionInfo, requireNotLoggedIn};