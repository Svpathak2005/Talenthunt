const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  mentorId: mongoose.Schema.Types.ObjectId,
  teamId: mongoose.Schema.Types.ObjectId,
  feedback: String,
  studentReply: String
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
