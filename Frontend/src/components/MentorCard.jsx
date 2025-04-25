import React, { useState } from 'react';

const MentorCard = ({ mentor, onSendRequest }) => {
  const [showModal, setShowModal] = useState(false);
  const [introduction, setIntroduction] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!introduction || introduction.length < 10) {
      setError('Please write an introduction with at least 10 characters');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSendRequest(mentor._id, introduction);
      setShowModal(false);
      setIntroduction('');
    } catch (err) {
      setError(err.message || 'Failed to send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative">
        {/* Profile Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {mentor.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {mentor.domain}
              </span>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Experience</h4>
          <p className="text-gray-700">{mentor.experience}</p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setShowModal(true);
            setError('');
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z" />
          </svg>
          <span>Request Mentorship</span>
        </button>
      </div>

      {/* Introduction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 animate-modal-in">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-gray-900">Request Mentorship</h4>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-2">
                  Introduce yourself to {mentor.name}
                </label>
                <textarea
                  id="introduction"
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Tell your potential mentor about yourself, your goals, and why you'd like their mentorship..."
                  className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Minimum 10 characters required
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !introduction.trim()}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isSubmitting || !introduction.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  } transition-all duration-300 flex items-center space-x-2`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-in {
          animation: modalIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MentorCard;