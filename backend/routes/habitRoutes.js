const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");

// Create a habit
router.post("/", async (req, res) => {
  try {
    const { title, description, time, status, userId } = req.body;
    const newHabit = new Habit({ title, description, time, status, userId });
    await newHabit.save();
    res.status(201).json({ message: "Habit created successfully", habit: newHabit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all habits
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single habit by ID
router.get("/:id", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a habit
router.put("/:id", async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedHabit) return res.status(404).json({ message: "Habit not found" });
    res.status(200).json({ message: "Habit updated successfully", habit: updatedHabit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a habit
router.delete("/:id", async (req, res) => {
  try {
    const deletedHabit = await Habit.findByIdAndDelete(req.params.id);
    if (!deletedHabit) return res.status(404).json({ message: "Habit not found" });
    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
