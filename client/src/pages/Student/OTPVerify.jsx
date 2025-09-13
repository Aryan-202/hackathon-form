// client/src/pages/Student/OTPVerify.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP } from '../../api/teamApi';

const OTPVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamId, emails } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [otpValues, setOtpValues] = useState({});
  const [message, setMessage] = useState('');

  const handleOtpChange = (email, value) => {
    setOtpValues({ ...otpValues, [email]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await verifyOTP(teamId, otpValues);
      if (response.success) {
        navigate('/student/success');
      } else {
        setMessage(response.message || 'Verification failed');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  if (!teamId || !emails) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-red-400 bg-gray-800 p-6 rounded-lg">
          Missing registration data. Please register first.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <style jsx="true">{`
        .glass-form {
          background-color: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .form-input {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease-in-out;
          color: #fff;
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .form-input:focus {
          outline: none;
          border-color: #63b3ed;
          box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.5);
        }
      `}</style>

      <div className="max-w-md w-full">
        <div className="glass-form rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-extrabold text-center mb-6">
            Verify Email OTPs
          </h2>
          
          <p className="text-center text-gray-300 mb-8">
            Enter the OTPs sent to your team members' emails
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {emails.map((email) => (
              <div key={email} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {email}
                </label>
                <input
                  type="text"
                  value={otpValues[email] || ''}
                  onChange={(e) => handleOtpChange(email, e.target.value)}
                  className="form-input w-full px-4 py-3 rounded-lg"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
              </div>
            ))}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                'Verify OTPs'
              )}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-center">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;