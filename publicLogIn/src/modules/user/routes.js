const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {requireAdmin, requireLoggedIn, requireSession} = require('../../jsonWebToken/middleware.js');

router.get('/all/:page',requireAdmin,async (req,res) =>{
    await controller.getAll(req,res);
});

router.get('/current',requireLoggedIn,async (req,res)=>{
    await controller.getCurrent(req,res);
});

router.get('/search/:id',requireAdmin,async (req,res)=>{
    await controller.getSearchId(req,res);
});

router.put('/current',requireLoggedIn, async (req,res)=>{
    await controller.putCurrent(req,res);
});

router.put('/search/:id',requireAdmin, async (req,res)=>{
    await controller.putSearchId(req,res);
});

router.delete('/current',requireLoggedIn,requireSession,async (req,res)=>{
    await controller.deleteCurrent(req,res);
});

router.delete('/search/:id',requireAdmin,requireSession,async (req,res)=>{
    await controller.deleteSearchId(req,res);
});

module.exports = router;