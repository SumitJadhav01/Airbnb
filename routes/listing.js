const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingCtlr = require ("../controllers/listings.js")
const multer  = require('multer')
const { storage }= require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    // Index route
    .get(wrapAsync(listingCtlr.index))
   // create route
    .post(isLoggedIn,
     upload.single('listing[image]'),
     validateListing,
     wrapAsync(listingCtlr.createListing));
     
router
      //New route
     .get("/new",isLoggedIn,
      wrapAsync(listingCtlr.new));

router
     .route("/:id")
     //show route
     .get(wrapAsync(listingCtlr.show))
     // update route
     .put(isLoggedIn,isOwner,
      upload.single('listing[image]'),
      validateListing,
      wrapAsync(listingCtlr.update))
      //delete route
     .delete(isLoggedIn,isOwner,
      wrapAsync(listingCtlr.delete));

router
     //edit route
     .get("/:id/edit",isLoggedIn,isOwner,
      wrapAsync(listingCtlr.edit));

module.exports = router;
