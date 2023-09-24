const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const recordRouter = require('./record');
const authHandler = require('../middlewares/auth-handler');

// import passport strategy
require('../config/passport');

router.use('/users', userRouter);
router.use('/records', authHandler, recordRouter);

router.get('/', (req, res) => res.redirect('/records'));

module.exports = router;
