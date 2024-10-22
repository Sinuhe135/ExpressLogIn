const validateUser = require('./schemas/user.js');
const validateParamId = require('../../utils/schemas/paramId.js');
const validateParamPage = require('../../utils/schemas/paramPage.js');
const response = require('../../utils/responses.js');
const {getAllUsers,getNumberOfPages,getUser, editUser, deleteUser} = require('../../databaseUtils/userUtils/user.js');

async function getAll(req,res)
{
    try {
        const validation = validateParamPage(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        let users,numberOfPages;
        [numberOfPages,users] = await Promise.all([getNumberOfPages(),getAllUsers(params.page)]);

        if(numberOfPages === 0)
        {
            response.error(req,res,'Sin registros',404);
            return;
        }
        else if(params.page > numberOfPages)
        {
            response.error(req,res,'Pagina fuera de los limites',404);
            return;
        }

        const resObject = {numberOfPages:numberOfPages,page:params.page,users:users};
        response.success(req,res,resObject,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function getCurrent(req,res)
{
    try {
        const user = await getUser(res.locals.idAuth);
    
        response.success(req,res,user,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function getSearchId(req,res)
{
    try {
        const validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        const user = await getUser(params.id);
        if(!user)
        {
            response.error(req,res,'No se encuentra un usuario con el ID proporcionado',404);
            return;
        }
    
        response.success(req,res,user,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function putCurrent(req,res)
{
    try 
    {
        validation = validateUser(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;
        
        const user = await editUser(body.name,body.patLastName,body.matLastName,body.phone,res.locals.idAuth);
        response.success(req,res,user,200);
    } 
    catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function putSearchId(req,res)
{
    try 
    {
        let validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        validation = validateUser(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        let user = await getUser(params.id);
        if(!user)
        {
            response.error(req,res,'No se encuentra un usuario con el ID proporcionado',404);
            return;
        }
        
        user = await editUser(body.name,body.patLastName,body.matLastName,body.phone,params.id);
        response.success(req,res,user,200);
    } 
    catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function deleteCurrent(req,res)
{
    try {
        const user = await deleteUser(res.locals.idAuth);

        deleteSession(res);
        
        response.success(req,res,user,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function deleteSearchId(req,res)
{
    try {
        let validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        let user = await getUser(params.id);
        if(!user)
        {
            response.error(req,res,'No se encuentra un usuario con el ID proporcionado',404);
            return;
        }

        user = await deleteUser(params.id);

        if(params.id === res.locals.idAuth)
        {
            deleteSession(res);
            user.selfDeleted = true;
        }
        else
        {
            user.selfDeleted = false;
        }
        
        response.success(req,res,user,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

function deleteSession(res)
{
    res.cookie('accessToken','',{maxAge:1});
    res.cookie('refreshToken','',{maxAge:1});
}


module.exports={getAll, getCurrent, getSearchId, putCurrent,putSearchId, deleteCurrent,deleteSearchId};