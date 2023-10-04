const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');
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

// facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['email', 'displayName'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      try {
        let user = await User.findOne({
          attributes: ['id', 'name', 'email', 'password'],
          where: { email },
          raw: true,
        });
        // already registered
        if (user) return done(null, user);

        // new one
        const randomPassword = Math.random().toString(36).slice(-8);
        const hash = await bcrypt.hash(randomPassword, 10);
        user = await User.create({ name, email, password: hash });
        done(null, { id: user.id, name: user.name, email: user.email });

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
