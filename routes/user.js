const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../models');
const { redirect } = require('express/lib/response');
const User = db.User;

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  console.log(req.body);
  const { name, email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    req.flash('error', 'All fields are required');
    return res.redirect('back');
  }
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('back');
  }
  return User.count({ where: { email } }).then((count) => {
    if (count > 0) {
      req.flash('error', 'Email already exists');
      return res.redirect('back');
    }
    return bcrypt.hash(password, 10).then((hash) => {
      User.create({ email, name, password: hash });
      req.flash('success', 'Registered successfully');
      return res.redirect('/users/login');
    });
  });
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) next(err);
    return res.redirect('/users/login');
  });
});

module.exports = router;
