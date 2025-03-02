const validateSignUp = require('./schemas/signup.js');
const validateLogIn = require('./schemas/login.js');
const response = require('../../utils/responses.js');
const bcrypt = require('bcrypt');
const {generateAccessToken,generateRefreshToken, getRefreshMaxAgeMili} = require('../../jsonWebToken/utils.js')
const {getAuthByUsername, createAuth, getAuth} = require('../../databaseUtils/auth.js');
const {createSession, deleteSession} = require('../../databaseUtils/session.js');
const { addUser}= require('./../user/controller.js');

async function login(req, res)
{
    try {
        const {error} = validateLogIn(req.body);
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }
    
        const auth = await getAuthByUsername(req.body.username);

        if(!auth)
        {
            response.error(req,res,'Usuario o contraseña incorrectos',400);
            return;
        }

        const resultado = await bcrypt.compare(req.body.password,auth.password);
        if(resultado)
        {
            await createJWTCookies(res,auth);
            response.success(req,res,{id:auth.id},200);
        }
        else
        {
            response.error(req,res,'Usuario o contraseña incorrectos',400);
        }

    } catch (error) {
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function logout(req, res)
{
    try {
        const session = await deleteSession(res.locals.idSession);
        res.cookie('accessToken','',{maxAge:1});
        res.cookie('refreshToken','',{maxAge:1});
        response.success(req,res,{id:session.idAuth},200);
    } catch (error) {
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function signup(req,res)
{
    try {
        const {error} = validateSignUp(req.body);
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }
    
        let auth = await getAuthByUsername(req.body.username);
        if(auth)
        {
            response.error(req,res,'El nombre de usuario ya existe',400);
            return;
        }
    
        const user = await addUser(req.body.name,req.body.active);
        
        const passwordHash = await hashPassword(req.body.password);
        auth = await createAuth(user.id,req.body.username, passwordHash);

        await createJWTCookies(res,auth);
    
        response.success(req,res,{id:user.id},201);
    } catch (error) {
        handleSignupError(error);
    }
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password.toString(),salt);
}

async function createJWTCookies(res, auth)
{
    const session = await createSession(auth.id);

    const accessToken = generateAccessToken(auth);
    const refreshToken = generateRefreshToken(session);

    res.cookie('accessToken',accessToken,{httpOnly:true,maxAge:getRefreshMaxAgeMili()});
    res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge:getRefreshMaxAgeMili()});
}

function handleSignupError(error)
{
    if(error.errno===1062)
    {
        response.error(req,res,'El nombre de usuario ya existe',400);
    }
    else
    {
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

module.exports={login, signup, logout};