const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  kudosReceived: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kudos'
  }],
  kudosGiven: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kudos'
  }]
});

module.exports = mongoose.model('User', userSchema);