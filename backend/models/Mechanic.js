const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    phoneNumber: {
        type: String,
        required: true,
    },

    workshopName: {
        type: String,
        required: true,
    },

    experience: {
        type: Number,
        default: 0,
    },

    services: {
        type: [String],
        default: [],
    },

    isOnline: {
        type: Boolean,
        default: false,
    },

    rating: {
        type: Number,
        default: 5,
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
    type: [Number],
    default: [0, 0],
  },
},

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

mechanicSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Mechanic", mechanicSchema);