const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const habitRoutes = require("./routes/habitRoutes");
const goalRoutes = require("./routes/goalRoutes");

app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/goals", goalRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Habit and Study Tracker API is running");
});

// MongoDB connection and server start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/habit-tracker";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });
