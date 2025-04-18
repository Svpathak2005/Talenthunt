import React from "react";

const TeamCard = ({ team }) => (
  <div className="border p-4 rounded shadow mb-4">
    <h3 className="text-lg font-semibold">Team ID: {team._id}</h3>
    <p>Domain: {team.domain}</p>
    <p>Category: {team.category}</p>
    <p>Mentor: {team.mentor?.name || "Not Assigned"}</p>
    <h4 className="font-semibold mt-2">Members:</h4>
    <ul className="list-disc list-inside">
      {team.members.map((member) => (
        <li key={member._id}>{member.name}</li>
      ))}
    </ul>
  </div>
);

export default TeamCard;
