const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {requireAdmin, requireLoggedIn, requireNotLoggedIn, requireSession} = require('./../../jsonWebToken/middleware.js');

router.get('/check',requireLoggedIn, async (req,res)=>{
    await controller.getCheck(req,res);
});

router.post('/login',requireNotLoggedIn, async (req,res)=>{
    await controller.login(req,res);
});

router.delete('/logout',requireLoggedIn, requireSession, async (req,res)=>{
    await controller.logout(req,res);
});

router.post('/signup',requireNotLoggedIn, async (req,res)=>{
    await controller.signup(req,res);
});

router.get('/verify/:id/:token', async (req, res)=>{
    await controller.verify(req,res);
});

router.put('/changePassword',requireLoggedIn,requireSession, async (req,res)=>{
    await controller.changePassword(req,res);
});

module.exports = router;