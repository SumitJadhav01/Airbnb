if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const path = require("path");
const expressErr = require("./utils/expressErr.js");
const session = require ("express-session");
const mongoSrote = require("connect-mongo");
const flash = require ("connect-flash");
const passport = require ("passport");
const LocalStrategy = require ("passport-local");
const user = require ("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const dburl = process.env.ATLASDB_URL;

const store =mongoSrote.create({
    mongoUrl:dburl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOpn = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+ 7*24*60*60*1000, 
    maxage:7*24*60*60*1000,
  }
  }

let port = 8080;
const app = express();
app.set("views engins", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOpn));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);

main()
  .then((res) => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dburl);
}
 
app.all("*", (req, res, next) => {
  next(new expressErr(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, (req, res) => {
  console.log("Server start now....");
});
 
