const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    jwt.verify(token, "your_secret_key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      req.userId = decoded.userId;
      next();
    });
  } else {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
