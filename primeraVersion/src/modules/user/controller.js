const validateUser = require('./schema.js');
const response = require('../../utils/responses.js');
const {getAllUsers,getUser, editUser, createUser, deleteUser} = require('../../databaseUtils/user.js');

async function checkAllUsers(req,res)
{
    try {
        const users = await getAllUsers();
        response.success(req,res,users,200);
    } catch (error) {
        console.log(error);
        respuesta.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function checkOneUser(req,res)
{
    try {
        const user = await getUser(res.locals.idAuth);
    
        if(!user)
        {
            response.error(req,res,'No existe un usuario con la ID proporcionada',404);
            return;
        }
    
        response.success(req,res,user,200);
    } catch (error) {
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}


async function addUser(name, active)
{
    const user = await createUser(name, active);
    return user;
}

async function changeUser(req,res)
{
    try {
        let user = await getUser(res.locals.id);
        if(!user)
        {
            response.error(req,res,'No existe un usuario con la ID proporcionada',404);
            return;
        }
    
        const {error} = validateUser(req.body);
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }
        
        user = await editUser(req.body.name,req.body.active,res.locals.id);
        response.success(req,res,user,200);
    } catch (error) {
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function eraseUser(req,res)
{
    try {
        let user = await getUser(req.params.id);
        if(!user)
        {
            response.error(req,res,'No existe un usuario con la ID proporcionada',404);
            return;
        }
    
        user = await deleteUser(req.params.id);
    
        response.success(req,res,user,200);
    } catch (error) {
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

module.exports={checkAllUsers, checkOneUser, addUser, changeUser, eraseUser};