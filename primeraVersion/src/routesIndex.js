const express = require('express');
const router = express.Router();

const userRoute = require('./modules/user/routes.js');
const authRoute = require('./modules/auth/routes.js');

router.use('/api/users',userRoute);
router.use('/api/auth',authRoute);

module.exports = router;