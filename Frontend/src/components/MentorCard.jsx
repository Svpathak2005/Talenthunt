import React, { useState } from 'react';

const MentorCard = ({ mentor, onSendRequest }) => {
  const [showModal, setShowModal] = useState(false);
  const [introduction, setIntroduction] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!introduction || introduction.length < 10) {
      setError('Please write an introduction with at least 10 characters');
      return;
    }
    setError('');
    try {
      await onSendRequest(mentor._id, introduction);
      setShowModal(false);
      setIntroduction('');
    } catch (err) {
      setError(err.message || 'Failed to send request');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{mentor.name}</h3>
          <p className="text-gray-600 mt-1">Domain: {mentor.domain}</p>
          <p className="text-gray-600">Experience: {mentor.experience}</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setError('');
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Request Mentorship
        </button>
      </div>

      {/* Introduction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Introduce Yourself</h4>
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="Write a brief introduction about yourself..."
              className="w-full h-32 p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setError('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorCard;