import React, { useEffect, useState } from "react";
import { getMentorRequests, approveMentorRequest, giveFeedback } from "../api/api";

const MentorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const token = localStorage.getItem("token");
  console.log(token);

  useEffect(() => {
    getMentorRequests(token).then(setRequests);
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Mentor Requests</h1>
      {requests.map((team) => (
        <div key={team._id} className="border p-4 my-2 rounded">
          <p>Team ID: {team._id}</p>
          <button onClick={() => approveMentorRequest(token, team._id)} className="bg-blue-500 text-white px-2 py-1 mr-2">Approve</button>
          <input type="text" className="border p-1 mr-2" placeholder="Feedback" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
          <button onClick={() => giveFeedback(token, team._id, feedbackText)} className="bg-green-600 text-white px-2 py-1">Send Feedback</button>
        </div>
      ))}
    </div>
  );
};

export default MentorDashboard;
