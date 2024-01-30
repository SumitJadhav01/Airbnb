const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");
const expressErr = require("./utils/expressErr.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl =req.originalUrl;
        req.flash("error", "You must be logged in to create listing !");
        return res.redirect("/login");
      }
next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl
  }
  next();
}

module.exports.isOwner= async(req,res,next)=>{
  let { id } = req.params;
  let list= await listing.findById(id);
  if(!list.Owner.equals(res.locals.currUser.id)){
  req.flash("error", "You don't have permission to edit !");
 return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressErr(404, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressErr(404, errMsg);
  } else {
    next();
  }
};

module.exports.isReview = async(req,res,next)=>{
  let {id,reviewId } = req.params;
  let review= await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser.id)){
  req.flash("error", "You don't create this review !");
 return res.redirect(`/listings/${id}`);
  }
  next();
}
