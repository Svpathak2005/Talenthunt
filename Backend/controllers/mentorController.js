const Team = require('../models/Team');
const Feedback = require('../models/Feedback');

exports.getMentorRequests = async (req, res) => {
  try {
    const teams = await Team.find({ mentor: null });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveMentorship = async (req, res) => {
  const { teamId } = req.body;
  try {
    const team = await Team.findByIdAndUpdate(
      teamId,
      { mentor: req.user.id },
      { new: true }
    );
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.giveFeedback = async (req, res) => {
  const { teamId, feedback } = req.body;
  try {
    const fb = await Feedback.create({ mentorId: req.user.id, teamId, feedback });
    res.status(201).json(fb);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTeamFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ mentorId: req.user.id });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.replyToStudent = async (req, res) => {
  const { feedbackId, studentReply } = req.body;
  try {
    const updated = await Feedback.findByIdAndUpdate(
      feedbackId,
      { studentReply },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
