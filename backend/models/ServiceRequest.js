const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mechanic",
        required: true,
    },

    serviceType: {
        type: String,
        required: true,
    },

    issueDescription: {
        type: String,
        default: "",
    },

    location: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
        default: "pending",
    },

    estimate: {
        labourCharge: {
            type: Number,
            default: 0
        },
        partsCharge: {
            type: Number,
            default: 0
        },
        travelCharge: {
            type: Number,
            default: 0
        },
        totalAmount: {
            type: Number,
            default: 0
        },
        approved: {
            type: Boolean,
            default: false
        }
    },

    payment: {
        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },
        amount: {
            type: Number,
            default: 0
        },
        paidAt: {
            type: Date,
            default: null
        }
    },

    rating: {
        score: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        },
        review: {
            type: String,
            default: ""
        },
        ratedAt: {
            type: Date,
            default: null
        }
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
