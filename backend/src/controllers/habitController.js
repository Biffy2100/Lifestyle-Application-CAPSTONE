const { validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all habits for logged in user
// @route   GET /api/habits
// @access  Private
const getHabits = asyncHandler(async (req, res) => {
  const { category, frequency, active } = req.query;
  
  // Build query
  const query = { user: req.user.id };
  
  if (category) query.category = category;
  if (frequency) query.frequency = frequency;
  if (active !== undefined) query.isActive = active === 'true';

  const habits = await Habit.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: habits.length,
    habits
  });
});

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
const createHabit = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const habitData = {
    ...req.body,
    user: req.user.id
  };

  const habit = await Habit.create(habitData);

  // Update user stats
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { 'stats.totalHabits': 1 }
  });

  res.status(201).json({
    success: true,
    message: 'Habit created successfully',
    habit
  });
});

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  let habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this habit'
    });
  }

  habit = await Habit.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Habit updated successfully',
    habit
  });
});

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this habit'
    });
  }

  await Habit.findByIdAndDelete(req.params.id);

  // Update user stats
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { 'stats.totalHabits': -1 }
  });

  res.status(200).json({
    success: true,
    message: 'Habit deleted successfully'
  });
});

// @desc    Toggle habit completion status
// @route   PATCH /api/habits/:id/toggle
// @access  Private
const toggleHabitCompletion = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      success: false,
      message: 'Habit not found'
    });
  }

  // Make sure user owns habit
  if (habit.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this habit'
    });
  }

  // Toggle completion
  const wasCompleted = habit.completed;
  await habit.markCompleted(!wasCompleted);

  // Update user stats
  const updateStats = {};
  if (!wasCompleted) {
    updateStats['$inc'] = { 
      'stats.totalCompletions': 1,
      'stats.experience': habit.reward || 10
    };
    
    // Update longest streak if current streak is higher
    if (habit.streak > req.user.stats.longestStreak) {
      updateStats['$set'] = { 'stats.longestStreak': habit.streak };
    }
  } else {
    updateStats['$inc'] = { 
      'stats.totalCompletions': -1,
      'stats.experience': -(habit.reward || 10)
    };
  }

  await User.findByIdAndUpdate(req.user.id, updateStats);

  res.status(200).json({
    success: true,
    message: `Habit ${!wasCompleted ? 'completed' : 'uncompleted'} successfully`,
    habit
  });
});

// @desc    Get habit statistics
// @route   GET /api/habits/stats
// @access  Private
const getHabitStats = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user.id, isActive: true });
  
  const stats = {
    totalHabits: habits.length,
    completedToday: habits.filter(h => h.completed).length,
    averageStreak: habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0,
    bestStreak: Math.max(...habits.map(h => h.bestStreak), 0),
    byCategory: {},
    byDifficulty: {}
  };

  // Group by category
  habits.forEach(habit => {
    if (!stats.byCategory[habit.category]) {
      stats.byCategory[habit.category] = {
        total: 0,
        completed: 0,
        avgStreak: 0
      };
    }
    stats.byCategory[habit.category].total++;
    if (habit.completed) stats.byCategory[habit.category].completed++;
    stats.byCategory[habit.category].avgStreak += habit.streak;
  });

  // Calculate average streaks by category
  Object.keys(stats.byCategory).forEach(category => {
    const cat = stats.byCategory[category];
    cat.avgStreak = cat.total > 0 ? Math.round(cat.avgStreak / cat.total) : 0;
  });

  // Group by difficulty
  habits.forEach(habit => {
    if (!stats.byDifficulty[habit.difficulty]) {
      stats.byDifficulty[habit.difficulty] = {
        total: 0,
        completed: 0
      };
    }
    stats.byDifficulty[habit.difficulty].total++;
    if (habit.completed) stats.byDifficulty[habit.difficulty].completed++;
  });

  res.status(200).json({
    success: true,
    stats
  });
});

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  getHabitStats
};