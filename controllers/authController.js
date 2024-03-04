const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    // Generate OTP (hardcoded to 1234)
    const otp = "1234";
    // Save OTP and expiry time in the database
    await User.findOneAndUpdate(
      { phone: mobile },
      { otp, otpExpiry: Date.now() + 60000 },
      { new: true, upsert: true }
    );
    return res.json({ success: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { mobile, name, dob, email, otp } = req.body;
    // Verify OTP
    //Need to validate the request body
    const user = await User.findOne({
      phone: mobile,
      otp,
      otpExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP or OTP expired" });
    }

    // Register the user
    await User.findByIdAndUpdate({ _id: user._id }, { name, email, dob });
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1d",
    });
    return res.json({ success: true, token });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    // Verify OTP
    const user = await User.findOne({
      phone: mobile,
      otp,
      otpExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP or OTP expired" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1d",
    });
    return res.json({ success: true, token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
