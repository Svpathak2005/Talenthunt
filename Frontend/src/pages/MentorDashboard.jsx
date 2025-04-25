import React, { useEffect, useState } from "react";
import { getMentorRequests, approveMentorRequest, giveFeedback, getTeamFeedback, getMentees } from "../api/api";

const MentorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      const [requestsData, menteesData, feedbackData] = await Promise.all([
        getMentorRequests(token),
        getMentees(token),
        getTeamFeedback(token)
      ]);
      
      setRequests(requestsData);
      setMentees(menteesData);
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleApprove = async (requestId) => {
    try {
      await approveMentorRequest(token, requestId);
      await fetchData(); // Refresh all data
      alert("Request approved successfully!");
    } catch (error) {
      console.error("Error approving request:", error);
      alert(error.message || "Failed to approve request");
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedStudent || !feedbackText.trim()) {
      alert("Please enter feedback text");
      return;
    }

    try {
      await giveFeedback(token, selectedStudent.studentId, feedbackText);
      await fetchData(); // Refresh feedback data
      setFeedbackText("");
      setShowFeedbackModal(false);
      setSelectedStudent(null);
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };

  const handleGiveFeedback = async (studentId) => {
    if (!studentId || !feedbackText.trim()) {
      alert('Please select a student and enter feedback text');
      return;
    }
  
    try {
      await giveFeedback(token, studentId, feedbackText);
      
      // Refresh feedback data
      const updatedFeedback = await getTeamFeedback(token);
      setFeedbacks(updatedFeedback);
      
      // Clear form
      setFeedbackText('');
      setSelectedStudent(null);
      
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.message || 'Failed to submit feedback');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Mentor Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
        </div>

        {/* Pending Requests Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Pending Mentorship Requests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Student Introduction</h3>
                    <p className="text-gray-600 mt-1">{request.introduction}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Domain: {request.domain}</p>
                      <p className="text-sm text-gray-500">Student: {request.studentName}</p>
                    </div>
                    <button
                      onClick={() => handleApprove(request._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No pending mentorship requests</p>
              </div>
            )}
          </div>
        </section>

        {/* Mentees Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Your Mentees
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentees.map((mentee) => (
              <div key={mentee._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{mentee.studentName}</h3>
                    <p className="text-gray-600 mt-1">Domain: {mentee.domain}</p>
                    <p className="text-gray-600">College: {mentee.college}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(mentee);
                      setShowFeedbackModal(true);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Give Feedback
                  </button>
                </div>
              </div>
            ))}
            {mentees.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No mentees yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Previous Feedbacks Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Previous Feedbacks
          </h2>

          <div className="space-y-6">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-800 font-medium">To: {feedback.studentName}</p>
                    <p className="text-gray-600 mt-1">{feedback.feedback}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {feedback.studentReply && (
                  <div className="mt-4 bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Student's response:</p>
                    <p className="text-gray-800 mt-1">{feedback.studentReply}</p>
                  </div>
                )}
              </div>
            ))}
            {feedbacks.length === 0 && (
              <p className="text-center text-gray-500">No feedback history</p>
            )}
          </div>
        </section>

        {/* Give Feedback Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Give Feedback
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <select
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedStudent || ''}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Select a student</option>
                {mentees.map((mentee) => (
                  <option key={mentee.studentId} value={mentee.studentId}>
                    {mentee.studentName}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="4"
              placeholder="Write your feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />

            <button
              onClick={() => handleGiveFeedback(selectedStudent)}
              disabled={!selectedStudent || !feedbackText.trim()}
              className={`${
                selectedStudent && feedbackText.trim()
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white px-6 py-2 rounded-lg transition-colors`}
            >
              Submit Feedback
            </button>
          </div>
        </section>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Give Feedback to {selectedStudent?.studentName}</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your feedback here..."
              className="w-full h-32 p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedStudent(null);
                  setFeedbackText("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
