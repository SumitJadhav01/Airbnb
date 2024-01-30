const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const { validateReview, isLoggedIn, isReview } = require("../middleware.js");
const  reviewCtlr = require ("../controllers/review.js")

//post review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewCtlr.createReview)
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReview,
  wrapAsync(reviewCtlr.destoryReview)
);
module.exports = router;
