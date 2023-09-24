const express = require('express');
const router = express.Router();
const userRouter = require('./user');

// import passport strategy
require('../config/passport');

router.use('/users', userRouter);

module.exports = router;
