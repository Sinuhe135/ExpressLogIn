const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {getAuthInfo} = require('./../../jsonWebToken/middleware.js');

router.get('/allUsersInfo',getAuthInfo,async (req,res) =>{
    await controller.checkAllUsers(req,res);
});

router.get('/userInfo',getAuthInfo,async (req,res)=>{
    await controller.checkOneUser(req,res);
});

// router.post('/', async (req,res)=>{
//     await controller.addUser(req,res);
// });

router.put('/updateUser',getAuthInfo, async (req,res)=>{
    await controller.changeUser(req,res);
});

router.delete('/deleteUser',getAuthInfo,async (req,res)=>{
    await controller.eraseUser(req,res);
});

module.exports = router;