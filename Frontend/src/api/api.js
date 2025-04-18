// api.js - Updated with new team functions

const API_BASE = "http://localhost:5000/api";

// Student APIs
export const registerEvent = async (token, data) => {
  return fetch(`${API_BASE}/student/register-event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const getEvents = async () => {
  return fetch(`${API_BASE}/admin/events`).then((res) => res.json());
};

export const getSuggestions = async (token) => {
  return fetch(`${API_BASE}/student/suggestions`, {
    headers: { Authorization: "Bearer " + token },
  }).then((res) => res.json());
};

export const sendTeamRequest = async (token, targetUserId, eventId) => {
  return fetch(`${API_BASE}/student/team-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ targetUserId, eventId }),
  }).then((res) => res.json());
};

// Get registered events for student
export const getRegisteredEvents = async (token) => {
  return fetch(`${API_BASE}/student/registered-events`, {
    headers: { Authorization: "Bearer " + token },
  }).then((res) => res.json());
};

// Match students by domain, category, and state
export const getMatchingStudentsFull = async (token) => {
  return fetch(`${API_BASE}/student/match`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => res.json());
};

// Get pending team requests for the current student
export const getTeamRequests = async (token) => {
  return fetch(`${API_BASE}/student/team-requests`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => res.json());
};

// Accept or deny a team request
export const approveTeamRequest = async (token, requestId, isApproved) => {
  return fetch(`${API_BASE}/student/approve-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ requestId, isApproved }),
  }).then((res) => res.json());
};

// Get current teammates for all events
export const getTeammates = async (token) => {
  return fetch(`${API_BASE}/student/teammates`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => res.json());
};

// Mentor APIs
export const getMentorRequests = async (token) => {
  return fetch(`${API_BASE}/mentor/requests`, {
    headers: { Authorization: "Bearer " + token },
  }).then((res) => res.json());
};

export const approveMentorRequest = async (token, teamId) => {
  return fetch(`${API_BASE}/mentor/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ teamId }),
  }).then((res) => res.json());
};

export const giveFeedback = async (token, teamId, feedback) => {
  return fetch(`${API_BASE}/mentor/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ teamId, feedback }),
  }).then((res) => res.json());
};