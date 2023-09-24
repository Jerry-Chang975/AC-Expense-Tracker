const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');
const db = require('../models');
const User = db.User;

// Local login strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        let user = await User.findOne({
          attributes: ['id', 'name', 'email', 'password'],
          where: { email },
          raw: true,
        });
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        let isMatch = await bcrypt.compare(password, user.password);
        isMatch
          ? done(null, user)
          : done(null, false, { message: 'Incorrect email or password.' });
      } catch (error) {
        error.errorMessage = 'Login failed';
        done(error);
      }
    }
  )
);

// serialize and deserialize user
passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

passport.deserializeUser((user, done) => {
  done(null, {
    id: user.id,
    name: user.name.length ? user.name : user.email.split('@')[0],
    email: user.email,
  });
});

module.exports = passport;
