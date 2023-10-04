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

// fb router
router.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/oauth2/redirect/facebook',
  passport.authenticate('facebook', {
    successRedirect: '/records',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
);

module.exports = router;
