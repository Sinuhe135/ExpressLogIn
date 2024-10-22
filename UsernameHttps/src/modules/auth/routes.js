const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {getAuthInfo, getSessionInfo, requireNotLoggedIn} = require('./../../jsonWebToken/middleware.js');

router.post('/login',requireNotLoggedIn, async (req,res)=>{
    await controller.login(req,res);
});

router.post('/logout',getAuthInfo,getSessionInfo, async (req,res)=>{
    await controller.logout(req,res);
});

router.post('/signup',requireNotLoggedIn, async (req,res)=>{
    await controller.signup(req,res);
});


module.exports = router;