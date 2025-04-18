import React, { useEffect, useState } from "react";
import {
  getEvents,
  registerEvent,
  getSuggestions,
  sendTeamRequest,
  getMatchingStudentsFull,
  getRegisteredEvents,
  getTeamRequests,
  approveTeamRequest,
  getTeammates
} from "../api/api";

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [matchingStudents, setMatchingStudents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [teammates, setTeammates] = useState([]);
  const [flippedEventId, setFlippedEventId] = useState(null);
  const [showFormFor, setShowFormFor] = useState(null);
  const [selectedEventForInvite, setSelectedEventForInvite] = useState(null);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    college: "",
    degree: "",
    studyYear: "",
    endYear: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Load all data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
        
        const suggestionsData = await getSuggestions(token);
        setSuggestions(suggestionsData);
        
        const matchingStudentsData = await getMatchingStudentsFull(token);
        setMatchingStudents(matchingStudentsData);
        
        const registeredEventsData = await getRegisteredEvents(token);
        setRegisteredEvents(registeredEventsData);
        
        const teamRequestsData = await getTeamRequests(token);
        setTeamRequests(teamRequestsData);
        
        const teammatesData = await getTeammates(token);
        setTeammates(teammatesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [token]);

  // Function to handle card flip
  const handleFlip = (eventId) => {
    setFlippedEventId(flippedEventId === eventId ? null : eventId);
    setShowFormFor(null);
  };

  // Handle form input changes
  const handleFormChange = (e) =>
    setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });

  // Register for an event
  const handleRegister = async (eventId) => {
    try {
      await registerEvent(token, {
        eventId,
        ...studentInfo,
        domain: user.domain,
        category: user.category,
      });
      alert("Successfully registered for the event!");
      setShowFormFor(null);
      setStudentInfo({
        name: "",
        college: "",
        degree: "",
        studyYear: "",
        endYear: "",
      });
      
      // Refresh registered events
      const registeredEventsData = await getRegisteredEvents(token);
      setRegisteredEvents(registeredEventsData);
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to register for the event. Please try again.");
    }
  };

  // Send team invite to another student
  const handleSendTeamRequest = async (targetUserId) => {
    if (!selectedEventForInvite) {
      alert("Please select an event to invite for");
      return;
    }
    
    try {
      const response = await sendTeamRequest(token, targetUserId, selectedEventForInvite);
      if (response.success) {
        alert("Team invite sent successfully!");
      } else {
        alert(`Failed to send invite: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending team request:", error);
      alert("Failed to send team invite. Please try again.");
    }
  };

  // Handle team request response (accept/deny)
  const handleTeamRequestResponse = async (requestId, isApproved) => {
    try {
      const response = await approveTeamRequest(token, requestId, isApproved);
      if (response.success) {
        alert(isApproved ? "Team request accepted!" : "Team request denied.");
        
        // Refresh team requests and teammates
        const teamRequestsData = await getTeamRequests(token);
        setTeamRequests(teamRequestsData);
        
        const teammatesData = await getTeammates(token);
        setTeammates(teammatesData);
      } else {
        alert(`Failed to process request: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error processing team request:", error);
      alert("Failed to process team request. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>

      {/* Upcoming Competitions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Upcoming Competitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isFlipped = flippedEventId === event._id;
            return (
              <div key={event._id} className="relative">
                <div
                  className={`relative h-64 transition-transform duration-500 transform-style-preserve-3d ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  <div
                    className="absolute w-full h-full backface-hidden bg-white border rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer"
                    onClick={() => handleFlip(event._id)}
                  >
                    <div>
                      <h2 className="text-xl font-semibold">{event.name}</h2>
                      <p className="text-sm text-gray-600">Host: {event.host}</p>
                      <p className="text-sm">
                        Deadline: {new Date(event.deadline).toDateString()}
                      </p>
                    </div>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFormFor(event._id);
                      }}
                    >
                      Register
                    </button>
                  </div>

                  <div
                    className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-100 border rounded-xl shadow-md p-4 overflow-auto cursor-pointer"
                    onClick={() => handleFlip(event._id)}
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      Event Description
                    </h3>
                    <p className="text-sm text-gray-700">
                      {event.description?.substring(0, 800)}...
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Event Registration */}
      {showFormFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-xl shadow-lg space-y-4 relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
              onClick={() => setShowFormFor(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Register for Event</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister(showFormFor);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                value={studentInfo.name}
                onChange={handleFormChange}
                placeholder="Your Name"
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <input
                type="text"
                name="college"
                value={studentInfo.college}
                onChange={handleFormChange}
                placeholder="College"
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <input
                type="text"
                name="degree"
                value={studentInfo.degree}
                onChange={handleFormChange}
                placeholder="Degree"
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <input
                type="text"
                name="studyYear"
                value={studentInfo.studyYear}
                onChange={handleFormChange}
                placeholder="Current Year of Study"
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <input
                type="text"
                name="endYear"
                value={studentInfo.endYear}
                onChange={handleFormChange}
                placeholder="Expected Graduation Year"
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Registered Events */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Registered Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registeredEvents.map((reg) => (
            <div
              key={reg._id}
              className="border rounded-xl p-4 bg-white shadow-lg"
            >
              <h3 className="text-lg font-semibold">{reg.eventId.name}</h3>
              <p className="text-sm text-gray-600">
                Host: {reg.eventId.host}
              </p>
              <p className="text-sm">
                Date: {new Date(reg.eventId.deadline).toDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Requests */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Team Requests</h2>
        {teamRequests.length === 0 ? (
          <p className="text-gray-500">No pending team requests.</p>
        ) : (
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3">From</th>
                <th className="text-left p-3">College</th>
                <th className="text-left p-3">State</th>
                <th className="text-left p-3">City</th>
                <th className="text-left p-3">Event</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamRequests.map((request) => (
                <tr key={request._id} className="border-t">
                  <td className="p-3">{request.fromUser.name}</td>
                  <td className="p-3">{request.fromUser.college}</td>
                  <td className="p-3">{request.fromUser.state}</td>
                  <td className="p-3">{request.fromUser.city}</td>
                  <td className="p-3">{request.event.name}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleTeamRequestResponse(request._id, true)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleTeamRequestResponse(request._id, false)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Teammates */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Teammates</h2>
        {teammates.length === 0 ? (
          <p className="text-gray-500">You don't have any teammates yet.</p>
        ) : (
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">College</th>
                <th className="text-left p-3">Domain</th>
                <th className="text-left p-3">State</th>
                <th className="text-left p-3">City</th>
                <th className="text-left p-3">Event</th>
              </tr>
            </thead>
            <tbody>
              {teammates.map((teammate) => (
                <tr key={teammate._id} className="border-t">
                  <td className="p-3">{teammate.user.name}</td>
                  <td className="p-3">{teammate.user.college}</td>
                  <td className="p-3">{teammate.user.domain}</td>
                  <td className="p-3">{teammate.user.state}</td>
                  <td className="p-3">{teammate.user.city}</td>
                  <td className="p-3">{teammate.event.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Matching Students */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Students with Same Domain</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Event for Team Invite:</label>
          <select 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            onChange={(e) => setSelectedEventForInvite(e.target.value)}
            value={selectedEventForInvite || ""}
          >
            <option value="">-- Select an Event --</option>
            {registeredEvents.map((reg) => (
              <option key={reg.eventId._id} value={reg.eventId._id}>
                {reg.eventId.name}
              </option>
            ))}
          </select>
        </div>
        
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Domain</th>
              <th className="text-left p-3">State</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {matchingStudents.map((stu) => (
              <tr key={stu._id} className="border-t">
                <td className="p-3">{stu.name}</td>
                <td className="p-3">{stu.domain}</td>
                <td className="p-3">{stu.state}</td>
                <td className="p-3">{stu.city}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleSendTeamRequest(stu._id)}
                    disabled={!selectedEventForInvite}
                    className={`${
                      selectedEventForInvite 
                        ? "bg-indigo-600 hover:bg-indigo-700" 
                        : "bg-gray-400 cursor-not-allowed"
                    } text-white px-3 py-1 rounded`}
                  >
                    Invite to Team
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;