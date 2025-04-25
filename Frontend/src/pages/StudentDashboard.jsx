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
  getTeammates,
  getMentorsByDomain,
  sendMentorRequest,
  getMentorFeedback,
  submitFeedbackResponse
} from "../api/api";
import MentorCard from "../components/MentorCard";

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
  const [mentors, setMentors] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackResponses, setFeedbackResponses] = useState({});

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

        // Fetch mentors in the same domain
        const mentorsData = await getMentorsByDomain(token);
        setMentors(mentorsData);
        
        // Fetch mentor feedback
        const feedbackData = await getMentorFeedback(token);
        setFeedbackList(feedbackData);
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

  const handleMentorRequest = async (mentorId, introduction) => {
    try {
      const result = await sendMentorRequest(token, mentorId, introduction);
      if (result.success) {
        alert("Mentor request sent successfully!");
      } else {
        alert(result.message || "Failed to send mentor request");
      }
    } catch (error) {
      console.error("Error sending mentor request:", error);
      alert(error.message || "Failed to send mentor request. Please try again.");
    }
  };

  const handleFeedbackResponse = async (feedbackId, response) => {
    try {
      await submitFeedbackResponse(token, feedbackId, response);
      // Refresh feedback after submitting response
      const updatedFeedback = await getMentorFeedback(token);
      setFeedbackList(updatedFeedback);
      // Clear response from temporary state
      setFeedbackResponses(prev => {
        const newState = { ...prev };
        delete newState[feedbackId];
        return newState;
      });
      alert("Response submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback response:", error);
      alert("Failed to submit response");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Registered Events Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Registered Events</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{registeredEvents.length}</h3>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Events you have registered for</p>
            </div>

            {/* Available Events Card */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Available Events</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{events.length}</h3>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Total events available</p>
            </div>
          </div>
        </div>

        {/* Upcoming Competitions */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Upcoming Competitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const isFlipped = flippedEventId === event._id;
              return (
                <div key={event._id} className="relative group perspective">
                  <div
                    className={`relative h-[300px] w-full transition-all duration-700 transform-gpu preserve-3d ${
                      isFlipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front Card */}
                    <div
                      className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between cursor-pointer border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                      onClick={() => handleFlip(event._id)}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-800">{event.name}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            New
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Host: {event.host}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(event.deadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFormFor(event._id);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Register Now
                      </button>
                    </div>

                    {/* Back Card */}
                    <div
                      className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl shadow-lg p-6 cursor-pointer border border-gray-100"
                      onClick={() => handleFlip(event._id)}
                    >
                      <div className="h-full flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Event Details</h3>
                        <div className="flex-grow overflow-auto prose prose-sm">
                          <p className="text-gray-600">
                            {event.description || "No description available"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleFlip(event._id)}
                          className="mt-4 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back to Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Registration Modal */}
        {showFormFor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-2xl space-y-6 relative animate-fadeIn">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowFormFor(null)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Register for Event</h2>
                <p className="text-gray-600 text-sm mt-1">Fill in your details to complete registration</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister(showFormFor);
                }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={studentInfo.name}
                    onChange={handleFormChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  <input
                    type="text"
                    name="college"
                    value={studentInfo.college}
                    onChange={handleFormChange}
                    placeholder="College"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  <input
                    type="text"
                    name="degree"
                    value={studentInfo.degree}
                    onChange={handleFormChange}
                    placeholder="Degree"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="studyYear"
                      value={studentInfo.studyYear}
                      onChange={handleFormChange}
                      placeholder="Current Year"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                    <input
                      type="text"
                      name="endYear"
                      value={studentInfo.endYear}
                      onChange={handleFormChange}
                      placeholder="Graduation Year"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Complete Registration
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Registered Events Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your Registered Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents.map((reg) => (
              <div
                key={reg._id}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{reg.eventId.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Registered
                  </span>
                </div>
                <p className="text-sm text-gray-600">Host: {reg.eventId.host}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(reg.eventId.deadline).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Requests */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Team Requests
            </h2>
            {teamRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending team requests</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.fromUser.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.fromUser.college}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.event.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleTeamRequestResponse(request._id, true)}
                            className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleTeamRequestResponse(request._id, false)}
                            className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                          >
                            Decline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Your Teammates */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Your Teammates
            </h2>
            {teammates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any teammates yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {teammates.map((teammate, index) => (
                  <div
                    key={`${teammate.teamId}-${teammate.user._id}-${index}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 rounded-full p-2">
                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{teammate.user.name}</h3>
                        <p className="text-sm text-gray-500">{teammate.user.college}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{teammate.event.name}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Find Teammates Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Teammates
            </h2>
            <div className="w-64">
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={(e) => setSelectedEventForInvite(e.target.value)}
                value={selectedEventForInvite || ""}
              >
                <option value="">Select Event</option>
                {registeredEvents.map((reg) => (
                  <option key={reg.eventId._id} value={reg.eventId._id}>
                    {reg.eventId.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {matchingStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {student.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.city}, {student.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleSendTeamRequest(student._id)}
                        disabled={!selectedEventForInvite}
                        className={`${
                          selectedEventForInvite
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        } px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200`}
                      >
                        Send Invite
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mentor Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Available Mentors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
                onSendRequest={handleMentorRequest}
              />
            ))}
          </div>
        </section>

        {/* Feedback Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Mentor Feedback
          </h2>
          <div className="space-y-6">
            {Array.isArray(feedbackList) && feedbackList.map((item) => (
              <div key={item._id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-800 font-medium">{item.mentorName}</p>
                    <p className="text-gray-600 mt-1">{item.feedback}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {!item.studentReply && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Write your response..."
                      className="w-full p-2 border rounded-lg"
                      rows="3"
                      onChange={(e) => setFeedbackResponses(prev => ({
                        ...prev,
                        [item._id]: e.target.value
                      }))}
                    />
                    <button
                      onClick={() => handleFeedbackResponse(item._id, feedbackResponses[item._id])}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send Response
                    </button>
                  </div>
                )}
                {item.studentReply && (
                  <div className="mt-4 bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Your response:</p>
                    <p className="text-gray-800 mt-1">{item.studentReply}</p>
                  </div>
                )}
              </div>
            ))}
            {(!Array.isArray(feedbackList) || feedbackList.length === 0) && (
              <p className="text-center text-gray-500">No feedback received yet</p>
            )}
          </div>
        </section>
      </div>

      {/* CSS for 3D card flip animation */}
      <style>{`
        .perspective {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;