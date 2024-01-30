const user = require("../models/user.js");

module.exports.renderSingupForm=(req, res) => {
    res.render("users/singup.ejs");
  }

module.exports.singup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new user({ email, username });
      const registerUser = await user.register(newUser, password);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcme to Wanderlust");
        res.redirect("listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/singup");
    }
  }

  module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.login=async (req, res) => {
    req.flash("success", " Welcome to Wanderlust you are logged in !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }


  module.exports.logout=(req, res, next) => {
    req.logout((err) => {
    if (err) {
    return next();
  }
    req.flash("success", " You are logged out !");
    res.redirect("/listings");
  });
  }