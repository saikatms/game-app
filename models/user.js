const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  name: String,
  dob: Date,
  email: String,
  otp: String,
  otpExpiry: Date,
  registrationDate: { type: Date, default: Date.now },
  scores: Array,
  // [{ score: Number, date: { type: Date, default: Date.now } }],
});

module.exports = mongoose.model("User", userSchema);
