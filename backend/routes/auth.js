const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register API
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      vehicleType,
      vehicleBrand,
      vehicleModel,
      vehicleNumber,
      emergencyContact
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      vehicleType,
      vehicleBrand,
      vehicleModel,
      vehicleNumber,
      emergencyContact
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful"
    });
  } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "user" },
      process.env.JWT_SECRET || "supersecurelocaldevsecretkey123!",
      { expiresIn: "7d" }
    );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          vehicleType: user.vehicleType,
          vehicleBrand: user.vehicleBrand,
          vehicleModel: user.vehicleModel,
          vehicleNumber: user.vehicleNumber,
          emergencyContact: user.emergencyContact
        }
      });
  } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Mechanic Login simulation API (for generating tokens in testing/dev)
router.post("/mechanic-login", async (req, res) => {
  try {
    const { mechanicId } = req.body;
    const Mechanic = require("../models/Mechanic");
    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic profile not found" });
    }

    const token = jwt.sign(
      { userId: mechanic._id, role: "mechanic" },
      process.env.JWT_SECRET || "supersecurelocaldevsecretkey123!",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Mechanic login successful",
      token,
      mechanic: {
        id: mechanic._id,
        fullName: mechanic.fullName,
        email: mechanic.email,
        phoneNumber: mechanic.phoneNumber
      }
    });
  } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Sync login for Guest / Google / Firebase social logins
router.post("/login-sync", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User profile not found in database" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "user" },
      process.env.JWT_SECRET || "supersecurelocaldevsecretkey123!",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Sync successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        vehicleType: user.vehicleType,
        vehicleBrand: user.vehicleBrand,
        vehicleModel: user.vehicleModel,
        vehicleNumber: user.vehicleNumber,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

module.exports = router;
