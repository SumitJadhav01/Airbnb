const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const  userCtlr = require ("../controllers/user.js")

router.
    route("/singup")
    //render singup form rout
    .get(userCtlr.renderSingupForm)
    //singup rout
    .post(wrapasync(userCtlr.singup));

router
    .route("/login")
    //render login form rout
    .get(userCtlr.renderLoginForm)
    //login rout
    .post(saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true}),
    userCtlr.login);

//logout rout
router.get("/logout",userCtlr.logout);

module.exports = router;
