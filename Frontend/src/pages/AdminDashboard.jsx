// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllRegistrations,
  getAllTeams,
  createEvent,
  getEvents
} from "../api/admin";

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [eventData, setEventData] = useState({
    name: "",
    host: "",
    teamSize: "",
    description: "",
    contactPerson: "",
    deadline: ""
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/");
      return;
    }

    getAllRegistrations(token).then(setRegistrations);
    getAllTeams(token).then(setTeams);
    getEvents().then(setEvents);
  }, [token, role, navigate]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createEvent(token, eventData);
    if (res && res._id) {
      alert("Event added!");
      setShowForm(false);
      setEventData({
        name: "",
        host: "",
        teamSize: "",
        description: "",
        contactPerson: "",
        deadline: ""
      });
      getEvents().then(setEvents);
    } else {
      alert("Failed to add event.");
    }
  };

  const registrationsByEvent = events.reduce((acc, event) => {
    acc[event._id] = registrations.filter((r) => r.eventId._id === event._id);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Registrations</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Event"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 border rounded shadow space-y-4 mb-6"
        >
          <h3 className="text-lg font-semibold">Add New Event</h3>
          <input name="name" placeholder="Event Name" onChange={handleChange} value={eventData.name} required className="w-full border p-2" />
          <input name="host" placeholder="Hosting College/Company" onChange={handleChange} value={eventData.host} required className="w-full border p-2" />
          <input name="teamSize" type="number" placeholder="Team Size" onChange={handleChange} value={eventData.teamSize} required className="w-full border p-2" />
          <textarea name="description" placeholder="Event Description" onChange={handleChange} value={eventData.description} required className="w-full border p-2" />
          <input name="contactPerson" placeholder="Contact Person" onChange={handleChange} value={eventData.contactPerson} required className="w-full border p-2" />
          <input name="deadline" type="date" onChange={handleChange} value={eventData.deadline} required className="w-full border p-2" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
        </form>
      )}

      {/* Event Registrations Table */}
      <h2 className="text-xl font-semibold mt-6">Event-wise Registrations</h2>
      {events.map((event) => (
        <div key={event._id} className="border rounded p-4 mt-4 shadow">
          <h3 className="text-lg font-bold mb-2">{event.name}</h3>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Student Name</th>
                <th className="px-2 py-1 border">College</th>
                <th className="px-2 py-1 border">Degree</th>
                <th className="px-2 py-1 border">Year</th>
                <th className="px-2 py-1 border">Domain</th>
                <th className="px-2 py-1 border">Category</th>
              </tr>
            </thead>
            <tbody>
              {(registrationsByEvent[event._id] || []).map((reg) => (
                <tr key={reg._id}>
                  <td className="border px-2 py-1">{reg.name}</td>
                  <td className="border px-2 py-1">{reg.college}</td>
                  <td className="border px-2 py-1">{reg.degree}</td>
                  <td className="border px-2 py-1">{reg.studyYear}</td>
                  <td className="border px-2 py-1">{reg.domain}</td>
                  <td className="border px-2 py-1">{reg.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Team Info */}
      <h2 className="text-xl font-semibold mt-10">All Teams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {teams.map((team) => (
          <div key={team._id} className="border p-4 rounded shadow">
            <p><strong>Team ID:</strong> {team._id}</p>
            <p><strong>Domain:</strong> {team.domain}</p>
            <p><strong>Category:</strong> {team.category}</p>
            <p><strong>Mentor:</strong> {team.mentor ? team.mentor.name : "Not Assigned"}</p>
            <p className="mt-2 font-semibold">Members:</p>
            <ul className="list-disc list-inside">
              {team.members.map((m) => (
                <li key={m._id}>{m.name} - {m.email}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
