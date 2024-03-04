const User = require("../models/user");

exports.getOverallScores = async (req, res) => {
  try {
    const { encryptedUserId } = req.body;
    // Fetch user by encrypted ID
    const user = await User.findById(encryptedUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const totalScores = user.scores.reduce(
      (total, score) => total + score.score,
      0
    );

    const allUsers = await User.find();
    allUsers.sort((a, b) => {
      const totalScoreA = a.scores.reduce(
        (total, score) => total + score.score,
        0
      );
      const totalScoreB = b.scores.reduce(
        (total, score) => total + score.score,
        0
      );
      return totalScoreB - totalScoreA;
    });
    // Find the position of the current user in the sorted list
    const rank =
      allUsers.findIndex(
        (u) => u._id.toString() === encryptedUserId.toString()
      ) + 1;

    return res.json({ success: true, rank, totalScores });
  } catch (error) {
    console.error("Error fetching overall scores:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getWeeklyScores = async (req, res) => {
  try {
    const { encryptedUserId } = req.body;
    // Fetch user by encrypted ID
    const user = await User.findById(encryptedUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get today's date
    const today = new Date();

    // Find the most recent Friday before today
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 2) % 7)); // Adjusting for week starting from Friday
    startOfWeek.setHours(0);
    startOfWeek.setMinutes(0);
    startOfWeek.setSeconds(0);

    // Find the previous Thursday from today
    const endOfWeek = new Date(today);
    // endOfWeek.setDate(today.getDate() - ((today.getDay() + 1) % 7)); // Adjusting for week ending on Thursday
    console.log(startOfWeek, endOfWeek);
    // Filter scores within the current week
    const weeklyScores = user.scores.filter((score) => {
      const scoreDate = new Date(score.date);
      return scoreDate >= startOfWeek && scoreDate <= endOfWeek;
    });

    // Calculate total scores for the week
    const totalScores = weeklyScores.reduce(
      (total, score) => total + score.score,
      0
    );

    return res.json({ success: true, weeklyScores, totalScores });
  } catch (error) {
    console.error("Error fetching weekly scores:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
