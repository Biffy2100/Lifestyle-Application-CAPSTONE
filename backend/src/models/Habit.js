const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: [100, 'Habit name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Health', 'Productivity', 'Learning', 'Social', 'Personal'],
    default: 'Personal'
  },
  icon: {
    type: String,
    required: [true, 'Icon is required'],
    enum: ['fitness', 'book', 'water', 'bed', 'walk', 'nutrition', 'phone', 'time'],
    default: 'fitness'
  },
  completed: {
    type: Boolean,
    default: false
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  bestStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  completionDates: [{
    date: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: true
    }
  }],
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  targetDays: {
    type: [Number], // Array of days (0-6 for weekly, 1-31 for monthly)
    default: []
  },
  reminderTime: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  reward: {
    type: Number,
    default: 10 // Experience points awarded for completion
  }
}, {
  timestamps: true
});

// Index for efficient querying
habitSchema.index({ user: 1, createdAt: -1 });
habitSchema.index({ user: 1, category: 1 });

// Update streak when habit is marked as completed
habitSchema.pre('save', function(next) {
  if (this.isModified('completed') && this.completed) {
    this.streak += 1;
    if (this.streak > this.bestStreak) {
      this.bestStreak = this.streak;
    }
  } else if (this.isModified('completed') && !this.completed && this.streak > 0) {
    this.streak = Math.max(0, this.streak - 1);
  }
  next();
});

// Virtual for calculating completion rate
habitSchema.virtual('completionRate').get(function() {
  if (this.completionDates.length === 0) return 0;
  
  const completedCount = this.completionDates.filter(d => d.completed).length;
  return Math.round((completedCount / this.completionDates.length) * 100);
});

// Method to mark habit as completed for today
habitSchema.methods.markCompleted = function(completed = true) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if there's already an entry for today
  const todayEntry = this.completionDates.find(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  if (todayEntry) {
    todayEntry.completed = completed;
  } else {
    this.completionDates.push({
      date: today,
      completed: completed
    });
  }
  
  this.completed = completed;
  return this.save();
};

// Static method to get habits for a user
habitSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId, isActive: true }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Habit', habitSchema);