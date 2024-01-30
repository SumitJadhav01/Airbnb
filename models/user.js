const mongoose = require ("mongoose");
const schema = mongoose.Schema;
const passportlcmg =require("passport-local-mongoose");

const userSchema = new schema ({
      email:{
        type:String,
        required:true
      }
});

userSchema.plugin(passportlcmg);
module.exports = mongoose.model('User', userSchema );