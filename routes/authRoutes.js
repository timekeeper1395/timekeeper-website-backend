const express = require("express");
const router = express.Router();
const User = require("../models/User"); // User model

// User Sign-Up
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required for signup." });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "Signup successful", user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Sign-Up Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User Sign-In
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
