// routes/studentRoutes.js

const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  registerForEvent,
  getMatchSuggestions,
  sendTeamRequest,
  getTeamRequests,
  approveTeamRequest,
  getRegisteredEvents,
  getMatchingStudentsFull,
  getTeammates  // New controller method for getting teammates
} = require('../controllers/studentController');

const router = express.Router();

// Event registration and matching
router.post('/register-event', auth(['student']), registerForEvent);
router.get('/registered-events', auth(['student']), getRegisteredEvents);
router.get('/suggestions', auth(['student']), getMatchSuggestions);
router.get('/match', auth(['student']), getMatchingStudentsFull);

// Team functionality
router.post('/team-request', auth(['student']), sendTeamRequest);
router.get('/team-requests', auth(['student']), getTeamRequests);
router.post('/approve-request', auth(['student']), approveTeamRequest);
router.get('/teammates', auth(['student']), getTeammates);  // New route for getting teammates

module.exports = router;