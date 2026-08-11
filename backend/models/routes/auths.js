const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

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

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password,10);


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
            message:"Registration successful"
        });


    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});


module.exports = router;