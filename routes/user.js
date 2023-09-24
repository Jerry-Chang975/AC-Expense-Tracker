const express = require('express');
const router = express.Router();
const passport = require('passport');

const userControllers = require('../controllers/user');

router.get('/login', userControllers.getLoginPage);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
);

router.get('/register', userControllers.getRegisterPage);

router.post('/register', userControllers.register);

router.post('/logout', userControllers.logout);

module.exports = router;
