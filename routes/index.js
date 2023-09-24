const express = require('express');
const router = express.Router();
const userRouter = require('./user');

// import passport strategy
require('../config/passport');

router.use('/users', userRouter);

router.get('/', (req, res) => res.render('index'));

module.exports = router;
