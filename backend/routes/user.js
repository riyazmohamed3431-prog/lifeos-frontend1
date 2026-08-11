const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// GET USER PROFILE
router.get("/profile", async (req, res) => {
    try {
        const { email } = req.query;

        const user = await User.findOne({ email }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// UPDATE USER PROFILE
router.put("/profile", async (req, res) => {
    try {
        const {
            email,
            fullName,
            phoneNumber,
            vehicleType,
            vehicleBrand,
            vehicleModel,
            vehicleNumber,
            emergencyContact,
        } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                fullName,
                phoneNumber,
                vehicleType,
                vehicleBrand,
                vehicleModel,
                vehicleNumber,
                emergencyContact,
            },
            {
                new: true,
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// REGISTER USER
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

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
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

        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

module.exports = router;