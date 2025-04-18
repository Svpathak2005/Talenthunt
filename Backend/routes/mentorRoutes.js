const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  getMentorRequests, approveMentorship,
  giveFeedback, getTeamFeedback, replyToStudent
} = require('../controllers/mentorController');

const router = express.Router();

router.get('/requests', auth(['mentor']), getMentorRequests);
router.post('/approve', auth(['mentor']), approveMentorship);
router.post('/feedback', auth(['mentor']), giveFeedback);
router.get('/feedbacks', auth(['mentor']), getTeamFeedback);
router.post('/reply', auth(['mentor']), replyToStudent);

module.exports = router;
