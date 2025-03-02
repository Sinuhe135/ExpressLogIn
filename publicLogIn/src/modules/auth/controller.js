const validateSignUp = require('./schemas/signup.js');
const validateLogIn = require('./schemas/login.js');
const validateChangePassword = require('./schemas/changePassword.js');
const validateParamId = require('../../utils/schemas/paramId.js');
const response = require('../../utils/responses.js');
const cookieProperties = require('./../../utils/cookieProperties.js')
const bcrypt = require('bcrypt');
const {generateAccessToken,generateRefreshToken, getRefreshMaxAgeMili} = require('../../jsonWebToken/utils.js')
const {getAuthByUsername, editPassword, getAuth} = require('../../databaseUtils/userUtils/auth.js');
const {createSession, deleteSession} = require('../../databaseUtils/userUtils/session.js');
const { createUser, getUser}= require('../../databaseUtils/userUtils/user.js');

async function login(req, res)
{
    try {
        const validation = validateLogIn(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;
    
        const auth = await getAuthByUsername(body.username);
        if(!auth)
        {
            response.error(req,res,'Usuario o contraseña incorrectos',400);
            return;
        }

        const resultado = await bcrypt.compare(body.password,auth.password);
        if(!resultado)
        {
            response.error(req,res,'Usuario o contraseña incorrectos',400);
            return;
        }

        const user = await getUser(auth.id);
        if(!user)
        {
            nse.error(req,res,'Usuario no encontrado',404);
            return;
        }

        await createJWTCookies(res,user);
        response.success(req,res,{id:user.id,type:user.type},200);

    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function logout(req, res)
{
    try {
        const session = await deleteSession(res.locals.idSession);
        res.cookie('accessToken','',{maxAge:1,httpOnly:true,sameSite:'None',secure:true});
        res.cookie('refreshToken','',{maxAge:1,httpOnly:true,sameSite:'None',secure:true});
        response.success(req,res,{id:session.idAuth},200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function getCheck(req, res)
{
    try {
        const type = res.locals.type;

        response.success(req,res,{type:type},200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function signup(req,res)
{
    try {
        const validation = validateSignUp(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;
    
        const auth = await getAuthByUsername(body.username);
        if(auth)
        {
            response.error(req,res,'El nombre de usuario ya existe',400);
            return;
        }
    
        const passwordHash = await hashPassword(body.password);
        const user = await createUser(body.name,body.patLastName,body.matLastName,body.phone,body.username,passwordHash,body.type);
    
        response.success(req,res,user,201);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function changePassword(req, res)
{
    try {
        let validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        validation = validateChangePassword(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        const auth = await getAuth(params.id);
        if(!auth)
        {
            response.error(req,res,'No se encuentra un usuario con el ID proporcionado',404);
            return; 
        }

        const authAdmin = await getAuthByUsername(res.locals.username);

        const resultado = await bcrypt.compare(body.password,authAdmin.password);
        if(!resultado)
        {
            response.error(req,res,'Contraseña del administrador incorrecta',400);
            return;
        }

        const passwordHash = await hashPassword(body.newPassword);
        const newAuth = await editPassword(passwordHash, params.id, res.locals.idSession);

        response.success(req,res,newAuth,201);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password.toString(),salt);
}

async function createJWTCookies(res, user)
{
    const AccessObject = {
        id:user.id,
        username:user.username,
        type:user.type
    };
    const session = await createSession(user.id);

    const accessToken = generateAccessToken(AccessObject);
    const refreshToken = generateRefreshToken(session);

    const properties = {...{maxAge:getRefreshMaxAgeMili()},...cookieProperties}

    res.cookie('accessToken',accessToken,properties);
    res.cookie('refreshToken',refreshToken,properties);
}

module.exports={login, signup, logout, changePassword, getCheck};