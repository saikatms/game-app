const User = require("../models/user");

exports.saveScore = async (req, res) => {
  try {
    const { encryptedUserId, score } = req.body;
    // Fetch user by encrypted ID
    const user = await User.findById(encryptedUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check score addition limit (3 times a day)
    if (user.scores.length >= 3) {
      return res
        .status(400)
        .json({ error: "Maximum score addition limit reached for today" });
    }
    // Validate score range
    if (score < 50 || score > 500) {
      return res
        .status(400)
        .json({ error: "Score must be between 50 and 500" });
    }
    // Add score
    user.scores.push({ score: parseInt(score), date: new Date() });
    await user.save();
    return res.json({ success: true });
  } catch (error) {
    console.error("Error saving score:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
