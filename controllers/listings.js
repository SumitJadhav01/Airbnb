const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
    const alllist = await listing.find({});
    res.render("listings/index.ejs", { alllist });}

module.exports.new=async (req, res) => {
    await res.render("listings/new.ejs");}

module.exports.show= async (req, res) => {
    let { id } = req.params;
    const list = await listing
    .findById(id)
    .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
    .populate("Owner");
    if (!list) {
    req.flash("error", "Listings you requested does not exist!");
    res.redirect("/listings");
  };
    res.render("listings/show.ejs", { list });
  };

  module.exports.createListing=async (req, res, next) => {

  let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send()
    let url = req.file.path;
    let filename = req.file.filename;
    const list = new listing(req.body.listing);
    list.Owner = req.user.id;
    list.image={url,filename};
    list.geometry =response.body.features[0].geometry;
    await list.save();
    req.flash("success", "New Listings Created !");
    res.redirect(`/listings`);
  };

  module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
    req.flash("error", "Listings you requested does not exist!");
    res.redirect("/listings");}
    let originalImageUrl = list.image.url;
    originalImageUrl =originalImageUrl.replace("/upload","/upload/h_100,w_100");
    res.render("listings/edit.ejs", { list ,originalImageUrl});
  };

  module.exports.update=async (req, res) => {
    let { id } = req.params;
    let list = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    list.image={url,filename};
    await list.save();
  };
    req.flash("success", "Listings Updated !");
    res.redirect(`/listings/${id}`);
  };

  module.exports.delete=async (req, res) => {
    let { id } = req.params;
    let delet = await listing.findByIdAndDelete(id);
    req.flash("success", "Listings  Deleted!");
    res.redirect("/listings");
  };