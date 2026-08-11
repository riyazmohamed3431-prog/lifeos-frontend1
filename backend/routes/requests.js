const express = require("express");
const router = express.Router();
const ServiceRequest = require("../models/ServiceRequest");
const Mechanic = require("../models/Mechanic");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");


// Create Service Request
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only customers can create service requests" });
        }
        const userId = req.user.userId;
        const { mechanicId, serviceType, issueDescription, location } = req.body;

        // Validation
        if (
            !mechanicId ||
            !serviceType ||
            !location ||
            location.latitude === undefined ||
            location.longitude === undefined
        ) {
            return res.status(400).json({
                message: "Missing required fields: mechanicId, serviceType, and location (latitude and longitude) are required",
            });
        }

        // Validate mechanic ID format
        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(mechanicId)) {
            return res.status(400).json({ message: "Invalid mechanic ID format" });
        }

        // Validate mechanic exists and is online
        const mechanicDoc = await Mechanic.findById(mechanicId);
        if (!mechanicDoc) {
            return res.status(404).json({ message: "Selected mechanic does not exist" });
        }
        if (!mechanicDoc.isOnline) {
            return res.status(400).json({ message: "Selected mechanic is currently offline/unavailable" });
        }

        const requestData = {
            user: userId,
            mechanic: mechanicId,
            serviceType,
            issueDescription: issueDescription || "",
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
            status: "pending",
        };

        const newRequest = new ServiceRequest(requestData);
        await newRequest.save();

        res.status(201).json(newRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Get Service Requests for a Mechanic
router.get("/mechanic/:mechanicId", authMiddleware, async (req, res) => {
    try {
        const { mechanicId } = req.params;

        if (req.user.role !== "mechanic" || req.user.userId !== mechanicId) {
            return res.status(403).json({ message: "Access denied. Mechanic profile mismatch." });
        }

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(mechanicId)) {
            return res.status(400).json({
                message: "Invalid mechanic ID format",
            });
        }

        const requests = await ServiceRequest.find({ mechanic: mechanicId }).sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Accept Service Request
router.patch("/:requestId/accept", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        if (req.user.role !== "mechanic" || request.mechanic.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. Request is not assigned to this mechanic." });
        }

        request.status = "accepted";
        request.updatedAt = new Date();
        await request.save();

        res.status(200).json({
            message: "Request accepted successfully",
            request,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Reject Service Request
router.patch("/:requestId/reject", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        if (req.user.role !== "mechanic" || request.mechanic.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. Request is not assigned to this mechanic." });
        }

        request.status = "rejected";
        request.updatedAt = new Date();
        await request.save();

        res.status(200).json({
            message: "Request rejected successfully",
            request,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Get Service Request Details
router.get("/:requestId", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId).populate("mechanic").populate("user");
        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        const reqUserId = request.user && (request.user._id || request.user).toString();
        const reqMechId = request.mechanic && (request.mechanic._id || request.mechanic).toString();

        if (req.user.userId !== reqUserId && req.user.userId !== reqMechId) {
            return res.status(403).json({ message: "Access denied. Unauthorized request view." });
        }

        res.status(200).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Complete Service Request
router.patch("/:requestId/complete", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        if (req.user.role !== "mechanic" || request.mechanic.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. Request is not assigned to this mechanic." });
        }

        request.status = "completed";
        request.updatedAt = new Date();
        await request.save();

        res.status(200).json({
            message: "Service request marked as completed",
            request,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Add Estimate to Service Request
router.patch("/:requestId/estimate", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;
        const { labourCharge = 0, partsCharge = 0, travelCharge = 0 } = req.body;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        if (req.user.role !== "mechanic" || request.mechanic.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. Request is not assigned to this mechanic." });
        }

        const totalAmount = Number(labourCharge) + Number(partsCharge) + Number(travelCharge);

        request.estimate = {
            labourCharge: Number(labourCharge),
            partsCharge: Number(partsCharge),
            travelCharge: Number(travelCharge),
            totalAmount,
        };
        request.updatedAt = new Date();
        await request.save();

        res.status(200).json({
            message: "Estimate added successfully",
            estimate: request.estimate,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Get Estimate for Service Request
router.get("/:requestId/estimate", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        const reqUserId = request.user && request.user.toString();
        const reqMechId = request.mechanic && request.mechanic.toString();
        if (req.user.userId !== reqUserId && req.user.userId !== reqMechId) {
            return res.status(403).json({ message: "Access denied. Unauthorized request view." });
        }

        if (
            !request.estimate ||
            (request.estimate.labourCharge === 0 &&
                request.estimate.partsCharge === 0 &&
                request.estimate.travelCharge === 0 &&
                request.estimate.totalAmount === 0)
        ) {
            return res.status(404).json({
                message: "Estimate not found",
            });
        }

        res.status(200).json({
            message: "Estimate fetched successfully",
            estimate: {
                labourCharge: request.estimate.labourCharge,
                partsCharge: request.estimate.partsCharge,
                travelCharge: request.estimate.travelCharge,
                totalAmount: request.estimate.totalAmount,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// Get Estimate
router.get("/:requestId/estimate", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;

        const mongoose = require("mongoose");

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        const reqUserId = request.user && request.user.toString();
        const reqMechId = request.mechanic && request.mechanic.toString();
        if (req.user.userId !== reqUserId && req.user.userId !== reqMechId) {
            return res.status(403).json({ message: "Access denied. Unauthorized request view." });
        }

        if (!request.estimate) {
            return res.status(404).json({
                message: "Estimate not found",
            });
        }

        res.status(200).json({
            message: "Estimate fetched successfully",
            estimate: request.estimate,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});


// Approve Estimate
router.patch("/:requestId/estimate/approve", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        if (req.user.role !== "user" || request.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. Only the request owner can approve the estimate." });
        }

        if (
            !request.estimate ||
            (request.estimate.labourCharge === 0 &&
                request.estimate.partsCharge === 0 &&
                request.estimate.travelCharge === 0 &&
                request.estimate.totalAmount === 0)
        ) {
            return res.status(400).json({
                message: "Estimate not found",
            });
        }

        request.estimate.approved = true;
        request.updatedAt = new Date();
        await request.save();

        res.status(200).json({
            message: "Estimate approved successfully",
            estimate: {
                labourCharge: request.estimate.labourCharge,
                partsCharge: request.estimate.partsCharge,
                travelCharge: request.estimate.travelCharge,
                totalAmount: request.estimate.totalAmount,
                approved: request.estimate.approved,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});


// Process Payment
router.patch("/:requestId/payment", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        if (req.user.role !== "user" || request.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. Only the request owner can process payment." });
        }

        // Check that estimate exists
        if (
            !request.estimate ||
            (request.estimate.labourCharge === 0 &&
                request.estimate.partsCharge === 0 &&
                request.estimate.travelCharge === 0 &&
                request.estimate.totalAmount === 0)
        ) {
            return res.status(400).json({
                message: "Estimate not found",
            });
        }

        // Check that estimate has been approved
        if (!request.estimate.approved) {
            return res.status(400).json({
                message: "Estimate must be approved before payment",
            });
        }

        request.payment = {
            status: "paid",
            amount: request.estimate.totalAmount,
            paidAt: new Date(),
        };
        request.updatedAt = new Date();
        await request.save();

        res.status(200).json({
            message: "Payment successful",
            payment: {
                status: "paid",
                amount: request.payment.amount,
                paidAt: request.payment.paidAt,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});


// Rate Mechanic
router.patch("/:requestId/rating", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;
        const { score, review } = req.body;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: "Invalid request ID format",
            });
        }

        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        if (req.user.role !== "user" || request.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. Only the request owner can submit a rating." });
        }

        // Check that payment exists and is completed
        if (!request.payment || request.payment.status !== "paid") {
            return res.status(400).json({
                message: "Payment must be completed before rating",
            });
        }

        // Validate score is a number between 1 and 5
        if (typeof score !== "number" || score < 1 || score > 5 || isNaN(score)) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
        }

        request.rating = {
            score: score,
            review: review || "",
            ratedAt: new Date(),
        };
        request.updatedAt = new Date();
        await request.save();

        // Recalculate mechanic rating
        const mechanicId = request.mechanic;
        const requests = await ServiceRequest.find({
            mechanic: mechanicId,
            "rating.score": { $gte: 1, $lte: 5 }
        });

        let totalScore = 0;
        requests.forEach(r => {
            totalScore += r.rating.score;
        });
        const averageRating = requests.length > 0 ? (totalScore / requests.length) : 0;
        const roundedAverage = Math.round(averageRating * 10) / 10;

        const mechanic = await Mechanic.findById(mechanicId);
        if (mechanic) {
            mechanic.rating = roundedAverage;
            await mechanic.save();
        }

        res.status(200).json({
            message: "Rating submitted successfully",
            rating: {
                score: request.rating.score,
                review: request.rating.review,
                ratedAt: request.rating.ratedAt,
            },
            mechanicRating: roundedAverage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

module.exports = router;

