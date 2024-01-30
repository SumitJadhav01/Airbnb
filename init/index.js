const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");
main()
  .then((res) => {
    console.log("connect");
  })
  .catch((err) => {
    console.log();
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

console.log(initdata.data);
const initDb = async () => {
  await listing.deleteMany({});
  initdata.data= initdata.data.map((obj=>({...obj,Owner:"65b55aeb4c04b86a3effad34"})));
  await listing.insertMany(initdata.data);
  console.log("datadsave");
};
initDb();

// Historic Cottage in Charleston
