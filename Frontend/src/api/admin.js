const API_BASE = "http://localhost:5000/api/admin";

// Fetch all student registrations
export const getAllRegistrations = async (token) => {
  return fetch(`${API_BASE}/registrations`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => res.json());
};

// Fetch all registered teams
export const getAllTeams = async (token) => {
  return fetch(`${API_BASE}/teams`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => res.json());
};

// Create a new event (used in admin dashboard form)
export const createEvent = async (token, data) => {
  return fetch(`${API_BASE}/add-event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

// Get all events (optional if needed elsewhere)
export const getEvents = async () => {
  return fetch(`${API_BASE}/events`).then((res) => res.json());
};
