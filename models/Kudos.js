const mongoose = require('mongoose');

const kudosSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  category: {
    type: String,
    enum: ['Teamwork', 'Innovation', 'Client Focus', 'Above and Beyond', 'Excellence', 'Helping Hand'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Map,
    of: Boolean,
    default: new Map()
  }
});

// Add a method to get like count
kudosSchema.methods.getLikeCount = function() {
  return Array.from(this.likes.values()).filter(Boolean).length;
};

module.exports = mongoose.model('Kudos', kudosSchema);