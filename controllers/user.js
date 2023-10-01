const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

function getLoginPage(req, res) {
  res.render('login');
}

function getRegisterPage(req, res) {
  res.render('register');
}

function register(req, res) {
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
}

function logout(req, res) {
  req.logout((error) => {
    if (error) next(error);
    return res.redirect('/users/login');
  });
}

module.exports = {
  getLoginPage,
  getRegisterPage,
  register,
  logout,
};
