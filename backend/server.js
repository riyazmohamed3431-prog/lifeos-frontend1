const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Enforce required production configuration
if (process.env.NODE_ENV === "production") {
    if (!process.env.JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in production environment variables.");
        process.exit(1);
    }
    if (!process.env.MONGODB_URI) {
        console.error("FATAL ERROR: MONGODB_URI is not defined in production environment variables.");
        process.exit(1);
    }
}

const app = express();

mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.log("🔴 Mongoose error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 Mongoose disconnected");
});

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");
    console.log("Database:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("LifeOS Backend is Running 🚀");
});

// Authentication Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const mechanicRoutes = require("./routes/mechanic");
const requestRoutes = require("./routes/requests");


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/mechanic", mechanicRoutes);
app.use("/api/requests", requestRoutes);

const PORT = process.env.PORT || 5001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;