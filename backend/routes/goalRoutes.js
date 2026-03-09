const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");

// Create a goal
router.post("/", async (req, res) => {
  try {
    const { title, description, deadline, status, userId } = req.body;
    const newGoal = new Goal({ title, description, deadline, status, userId });
    await newGoal.save();
    res.status(201).json({ message: "Goal created successfully", goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single goal by ID
router.get("/:id", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a goal
router.put("/:id", async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedGoal) return res.status(404).json({ message: "Goal not found" });
    res.status(200).json({ message: "Goal updated successfully", goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a goal
router.delete("/:id", async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) return res.status(404).json({ message: "Goal not found" });
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
