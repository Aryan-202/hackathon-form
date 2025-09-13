import React, { useState, useEffect } from 'react';

// Mock API function to simulate backend verification.
// This function resolves or rejects based on simple logic for demonstration.
// It now only expects OTPs from members, as per your backend logic.
const verifyOTP = (teamId, otpValues) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if all provided OTPs (from members) are correct.
      const allMemberOTPsCorrect = Object.values(otpValues).every(otp => otp === '123456');
      
      if (allMemberOTPsCorrect && Object.keys(otpValues).length > 0) {
        resolve({ success: true, message: 'OTP verified successfully' });
      } else {
        reject({ message: 'One or more member OTPs are incorrect or missing.' });
      }
    }, 1500);
  });
};

// Custom modal component to replace the browser's alert()
const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
        <p className="text-gray-800 text-lg font-medium mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Component for the OTP verification form
const OTPVerifyComponent = ({ teamMembers, teamId, onVerifySuccess, onErrorMessage }) => {
  const [loading, setLoading] = useState(false);
  const [otpValues, setOtpValues] = useState({});

  const handleOtpChange = (email, value) => {
    setOtpValues({
      ...otpValues,
      [email]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Only send the OTPs for members, as per your backend logic.
    const memberOtps = {};
    teamMembers.filter(member => member.role === 'member').forEach(member => {
        if (otpValues[member.email]) {
          memberOtps[member.email] = otpValues[member.email];
        }
    });

    try {
      const response = await verifyOTP(teamId, memberOtps);
      if (response.success) {
        onVerifySuccess();
      } else {
        onErrorMessage(response.message || 'OTP verification failed');
      }
    } catch (error) {
      onErrorMessage(error.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto relative z-10">
        <div className="bg-white shadow-2xl rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Verify Team Emails
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Please enter the OTPs sent to your team members' emails. The team leader does not receive an OTP.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {teamMembers.filter(member => member.role === 'member').map((member) => (
              <div key={member.email} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {member.email}
                  </label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                    Member
                  </span>
                </div>
                <input
                  type="text"
                  value={otpValues[member.email] || ''}
                  onChange={(e) => handleOtpChange(member.email, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
              </div>
            ))}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? 'Verifying...' : 'Verify OTPs'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Success Page Component
const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white shadow-2xl rounded-3xl p-8">
          <svg className="w-16 h-16 mx-auto text-green-500 mb-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Verification Successful!
          </h2>
          <p className="text-gray-600">
            Your team has been successfully registered. You can now proceed.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main application component that manages state and "routing"
export default function App() {
  const [page, setPage] = useState('verify');
  const [pageState, setPageState] = useState({ 
    teamMembers: [
      { email: 'leader@example.com', role: 'leader' },
      { email: 'member1@example.com', role: 'member' },
      { email: 'member2@example.com', role: 'member' },
    ], 
    teamId: 'team123' 
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // This useEffect simulates the initial redirection logic
    if (!pageState.teamMembers.length) {
      console.log('No team members found, simulating redirect.');
    }
  }, [pageState]);

  const handleVerifySuccess = () => {
    setPage('success');
  };

  const handleErrorMessage = (msg) => {
    setMessage(msg);
  };

  const handleCloseModal = () => {
    setMessage('');
  };

  let content;
  switch (page) {
    case 'verify':
      content = pageState.teamMembers.length ? (
        <OTPVerifyComponent
          teamMembers={pageState.teamMembers}
          teamId={pageState.teamId}
          onVerifySuccess={handleVerifySuccess}
          onErrorMessage={handleErrorMessage}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen text-gray-700">Loading...</div>
      );
      break;
    case 'success':
      content = <SuccessPage />;
      break;
    default:
      content = <div className="flex items-center justify-center min-h-screen text-gray-700">Page not found.</div>;
  }

  return (
    <>
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f3f4f6;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
      <div className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        {content}
      </div>
      <MessageModal message={message} onClose={handleCloseModal} />
    </>
  );
}
