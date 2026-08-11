const express = require("express");
const router = express.Router();
const Mechanic = require("../models/Mechanic");
const authMiddleware = require("../middleware/auth");

// Register Mechanic
router.post("/register", async (req, res) => {
    try {
        const mechanic = new Mechanic(req.body);

        await mechanic.save();

        res.status(201).json({
            message: "Mechanic registered successfully",
            mechanic,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// UPDATE MECHANIC PROFILE
router.put("/profile", async (req, res) => {
    try {
        const {
            email,
            fullName,
            phoneNumber,
            workshopName,
            experience,
            services,
            isOnline,
            location,
        } = req.body;

        const updatedMechanic = await Mechanic.findOneAndUpdate(
            { email },
            {
                fullName,
                phoneNumber,
                workshopName,
                experience,
                services,
                isOnline,
                location,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedMechanic) {
            return res.status(404).json({
                message: "Mechanic not found",
            });
        }

        res.status(200).json({
            message: "Mechanic profile updated successfully",
            mechanic: updatedMechanic,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Get Mechanic Profile
router.get("/profile", async (req, res) => {
    try {
        const { email } = req.query;

        const mechanic = await Mechanic.findOne({ email });

        if (!mechanic) {
            return res.status(404).json({
                message: "Mechanic not found",
            });
        }

        res.status(200).json(mechanic);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Update Mechanic Online/Offline Status
router.patch("/status", async (req, res) => {
    try {
        const { email, isOnline } = req.body;

        if (!email || isOnline === undefined || typeof isOnline !== "boolean") {
            return res.status(400).json({
                message: "Email and boolean isOnline status are required",
            });
        }

        const updatedMechanic = await Mechanic.findOneAndUpdate(
            { email },
            { $set: { isOnline } },
            { new: true, runValidators: true }
        );

        if (!updatedMechanic) {
            return res.status(404).json({
                message: "Mechanic not found",
            });
        }

        res.status(200).json({
            message: "Mechanic online status updated successfully",
            email: updatedMechanic.email,
            isOnline: updatedMechanic.isOnline,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// GET NEARBY ONLINE MECHANICS
router.get("/nearby", authMiddleware, async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({
                message: "Latitude and Longitude query parameters are required and must be valid numbers",
            });
        }

        // MongoDB geospatial query using $near on the location field
        const mechanics = await Mechanic.find({
            isOnline: true,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat], // GeoJSON is [longitude, latitude]
                    },
                    $maxDistance: 25000, // Search radius: 25km (25000 meters)
                },
            },
        }).select("-email -phoneNumber -createdAt -__v");

        // Helper to calculate exact Haversine distance
        function getDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) *
                    Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }

        const formatted = mechanics.map(m => {
            const mLat = m.location.coordinates[1];
            const mLng = m.location.coordinates[0];
            const dist = getDistance(lat, lng, mLat, mLng);
            return {
                _id: m._id,
                fullName: m.fullName,
                workshopName: m.workshopName,
                experience: m.experience,
                services: m.services,
                rating: m.rating,
                distance: Math.round(dist * 10) / 10,
                isOnline: m.isOnline
            };
        });

        res.status(200).json({
            count: formatted.length,
            mechanics: formatted,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

module.exports = router;