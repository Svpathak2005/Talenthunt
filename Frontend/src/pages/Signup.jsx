import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    college: "",
    state: "",
    city: "",
    domain: "",
    category: "",
    experience: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(formData);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(data.user)); // assuming user object is returned
        localStorage.setItem("role", data.user?.role || "student");

        alert("Registration successful!");
        navigate("/"); // or navigate based on role
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold mb-2">Signup</h1>

        <input className="w-full border p-2" name="name" placeholder="Name" onChange={handleChange} required />
        <input className="w-full border p-2" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="w-full border p-2" type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <label className="block text-sm font-medium">Select Role</label>
        <select className="w-full border p-2" name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>

        <input className="w-full border p-2" name="college" placeholder="College" onChange={handleChange} />
        <input className="w-full border p-2" name="state" placeholder="State" onChange={handleChange} />
        <input className="w-full border p-2" name="city" placeholder="City" onChange={handleChange} />

        <label className="block text-sm font-medium">Domain</label>
        <select className="w-full border p-2" name="domain" onChange={handleChange}>
          <option value="">Select Domain</option>
          <option value="AI">AI</option>
          <option value="Web Dev">Web Dev</option>
          <option value="IoT">IoT</option>
        </select>

        <label className="block text-sm font-medium">Category</label>
        <select className="w-full border p-2" name="category" onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="Robotics">Robotics</option>
          <option value="SaaS">SaaS</option>
          <option value="Mobile">Mobile</option>
        </select>

        {formData.role === "mentor" && (
          <input
            className="w-full border p-2"
            name="experience"
            placeholder="Experience (for mentors)"
            onChange={handleChange}
          />
        )}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
