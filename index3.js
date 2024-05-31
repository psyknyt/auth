require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");

require("./instagramStrategy");

const app = express();

app.use(
  session({
    secret: "27af80c1bf33e87d46dd4b116bc39a9d",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/instagram", passport.authenticate("instagram"));

app.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: req.user.profile,
      accessToken: req.user.accessToken,
    });
  } else {
    res.redirect("/");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
