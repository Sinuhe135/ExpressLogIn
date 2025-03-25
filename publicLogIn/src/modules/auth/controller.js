const validateSignUp = require('./schemas/signup.js');
const validateLogIn = require('./schemas/login.js');
const validateChangePassword = require('./schemas/changePassword.js');
const validateVerify = require('./schemas/verify.js')
const response = require('../../utils/responses.js');
const cookieProperties = require('./../../utils/cookieProperties.js')
const bcrypt = require('bcrypt');
const {v4:uuidv4} = require('uuid');
const {generateAccessToken,generateRefreshToken, getRefreshMaxAgeMili} = require('../../jsonWebToken/utils.js')
const {getAuthByEmail, editPassword,checkAuthEmail} = require('../../databaseUtils/userUtils/auth.js');
const {createSession, deleteSession} = require('../../databaseUtils/userUtils/session.js');
const { createUser, getUser, verifyUser, deleteUnverifiedUser, deleteUser}= require('../../databaseUtils/userUtils/user.js');
const {getToken} = require('./../../databaseUtils/userUtils/token.js')

const {testEmailSender, sendEmail} = require('../../utils/emailSender.js')

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
    
        const auth = await getAuthByEmail(body.email);
        if(!auth)
        {
            response.error(req,res,'Correo o contraseña incorrectos',400);
            return;
        }

        const resultado = await bcrypt.compare(body.password,auth.password);
        if(!resultado)
        {
            response.error(req,res,'Correo o contraseña incorrectos',400);
            return;
        }

        const user = await getUser(auth.id);
        if(!user)
        {
            response.error(req,res,'Usuario no encontrado o desactivado',404);
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
        const id = res.locals.idAuth;

        response.success(req,res,{id:id,type:type},200);
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

        const auth = await checkAuthEmail(body.email);
        if(auth)
        {
            if(auth.status !== 'unverified')
            {
                response.error(req,res,'El correo ya está registrado',400);
                return;
            }
            
            await deleteUnverifiedUser(auth.id);
        }

        const token = uuidv4();
        const tokenHash = await hashText(token);
        if(process.env.NODE_ENV === 'development')
        {
            console.log(token);
        }

        const passwordHash = await hashText(body.password);

        const idUser = await createUser(body.name,body.patLastName,body.matLastName,body.phone,body.email,passwordHash, tokenHash);

        const frontVerificationUrl = "http://localhost:3000/verification/"
        const emailHtml = `
            <p>Verifica tu correo electrónico para completar el proceso de registro en la aplicación</p>
            <p>Verifica pulsando 
                <a href="${frontVerificationUrl +idUser+"/"+token}">aquí</a>
            </p>
        `;

        await sendEmail(body.email, 'Verifica tu correo electrónico', emailHtml);
    
        response.success(req,res,{id:idUser},201);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

//hacer endpoint de reenvio de token al mismo email
//para reenviar el token hay que eliminarlo y crear otro, por el hash
//mejorar endpoint de cambiar de contraseña (no prioridad)
//pensar en posibles escenarios que se puedan complicar si hay exepciones en funciones adelante

async function verify(req, res) {
    try {
        const validation = validateVerify(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        const userToken = await getToken(params.id);
        if(!userToken)
        {
            response.error(req,res,'El token de verificación no se encuentra o ya ha sido verificado',400);
            return;
        }

        const resultado = await bcrypt.compare(params.token,userToken.token);
        if(!resultado)
        {
            response.error(req,res,'Token de verificación incorrecto',400);
            return;
        }
        
        const tokenDate = userToken.date * 1000;
        if(!checkVerificationExpirationDate(tokenDate))
        {
            await deleteUnverifiedUser(userToken.id);
            
            response.error(req,res,'Token de verificación expirado',400);
            return;       
        }

        await verifyUser(userToken.id);

        const user = await getUser(userToken.id);
        if(!user)
        {
            response.error(req,res,'Usuario no encontrado',404);
            return;
        }
        await createJWTCookies(res,user);

        response.success(req,res,{id:user.id,type:user.type},201);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

function checkVerificationExpirationDate(date)
{
    const expirationTime = 1 * (60 * 60 * 1000); //hours, value in miliseconds
    // const expirationTime = 10 * 1000;

    const tokenLimitTime = date + expirationTime;

    if(Date.now() > tokenLimitTime)
    {
        return false;
    }

    return true;
}

async function changePassword(req, res)
{
    try {
        validation = validateChangePassword(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        const auth = await getAuthByEmail(res.locals.email);
        if(!auth)
        {
            response.error(req,res,'Usuario no encontrado',400);
            return;
        }

        const resultado = await bcrypt.compare(body.password,auth.password);
        if(!resultado)
        {
            response.error(req,res,'Contraseña incorrecta',400);
            return;
        }

        const passwordHash = await hashPassword(body.newPassword);
        const newAuth = await editPassword(passwordHash, res.locals.idAuth, res.locals.idSession);

        response.success(req,res,{id:newAuth},201);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function hashText(text) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(text.toString(),salt);
}

async function createJWTCookies(res, user)
{
    const AccessObject = {
        id:user.id,
        email:user.email,
        type:user.type
    };
    const session = await createSession(user.id);

    const accessToken = generateAccessToken(AccessObject);
    const refreshToken = generateRefreshToken(session);

    const properties = {...{maxAge:getRefreshMaxAgeMili()},...cookieProperties}

    res.cookie('accessToken',accessToken,properties);
    res.cookie('refreshToken',refreshToken,properties);
}

module.exports={login, signup,verify, logout, changePassword, getCheck};