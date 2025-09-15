const express = require('express');
const { body } = require('express-validator');
const {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  getHabitStats
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All habit routes require authentication
router.use(protect);

// Validation rules
const createHabitValidation = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Habit name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Habit name must be between 1 and 100 characters'),
  body('category')
    .isIn(['Health', 'Productivity', 'Learning', 'Social', 'Personal'])
    .withMessage('Invalid category'),
  body('icon')
    .isIn(['fitness', 'book', 'water', 'bed', 'walk', 'nutrition', 'phone', 'time'])
    .withMessage('Invalid icon'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Invalid frequency'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level')
];

const updateHabitValidation = [
  body('text')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Habit name cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Habit name must be between 1 and 100 characters'),
  body('category')
    .optional()
    .isIn(['Health', 'Productivity', 'Learning', 'Social', 'Personal'])
    .withMessage('Invalid category'),
  body('icon')
    .optional()
    .isIn(['fitness', 'book', 'water', 'bed', 'walk', 'nutrition', 'phone', 'time'])
    .withMessage('Invalid icon'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Invalid frequency'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot be more than 500 characters')
];

// Routes
router.get('/', getHabits);
router.post('/', createHabitValidation, createHabit);
router.put('/:id', updateHabitValidation, updateHabit);
router.delete('/:id', deleteHabit);
router.patch('/:id/toggle', toggleHabitCompletion);
router.get('/stats', getHabitStats);

module.exports = router;