const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware pour verifier si user est authentifie
const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Acces refuse" });
  }
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(400).json({ message: "Token invalide" });
  }
};

// Middleware pour verifier si user est admin(permission)
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acces interdit" });
  }
  next();
};

module.exports = { auth, isAdmin };
