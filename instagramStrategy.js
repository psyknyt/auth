const passport = require("passport");
const InstagramStrategy = require("passport-instagram").Strategy;

passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/instagram/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Store or use the profile and accessToken as needed
      return done(null, { profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
