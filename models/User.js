const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },

  Password: {
    type: String,
    required: true,
  },

  mobileNumber:{
    type:"String",
    required:true,
  },

  token: {
    type: String,
  },


});


module.exports = mongoose.model("user", userSchema);
