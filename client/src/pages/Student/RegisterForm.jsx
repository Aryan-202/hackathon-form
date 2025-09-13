import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { registerTeam } from "../../api/teamApi";

// A simple component to show a custom message box

const MessageBox = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="bg-gray-800 bg-opacity-75 backdrop-filter backdrop-blur-sm rounded-lg p-6 shadow-xl text-white max-w-sm w-full text-center">
      <p className="text-lg font-semibold mb-4">{message}</p>

      <button
        onClick={onClose}
        className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        OK
      </button>
    </div>
  </div>
);

export default function RegisterForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    teamName: "",

    leader: {
      name: "",

      regNo: "",

      email: "",
    },

    members: [
      { name: "", regNo: "", email: "" },

      { name: "", regNo: "", email: "" },
    ],
  });

  const handleChange = (e, index, field) => {
    if (field === "leader") {
      setFormData({
        ...formData,

        leader: {
          ...formData.leader,

          [e.target.name]: e.target.value,
        },
      });
    } else if (field === "member") {
      const updatedMembers = [...formData.members];

      updatedMembers[index] = {
        ...updatedMembers[index],

        [e.target.name]: e.target.value,
      };

      setFormData({
        ...formData,

        members: updatedMembers,
      });
    } else {
      setFormData({
        ...formData,

        [e.target.name]: e.target.value,
      });
    }
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z]+\.[a-zA-Z0-9]+@vitapstudent\.ac\.in$/;

    return regex.test(email);
  };

  const validateForm = () => {
    if (!formData.teamName.trim()) {
      setMessage("Team name is required");

      return false;
    }

    if (
      !formData.leader.name.trim() ||
      !formData.leader.regNo.trim() ||
      !formData.leader.email.trim()
    ) {
      setMessage("Please complete all leader fields");

      return false;
    }

    if (!validateEmail(formData.leader.email)) {
      setMessage(
        "Leader email must be in the format: name.regNo@vitapstudent.ac.in"
      );

      return false;
    }

    // Validate first team member (required)

    const firstMember = formData.members[0];

    if (
      !firstMember.name.trim() ||
      !firstMember.regNo.trim() ||
      !firstMember.email.trim()
    ) {
      setMessage(
        "Please complete all fields for Member 1, as it is a required field."
      );

      return false;
    }

    if (!validateEmail(firstMember.email)) {
      setMessage(
        "Member 1 email must be in the format: name.regNo@vitapstudent.ac.in"
      );

      return false;
    }

    // Validate second team member (completely optional - only validate if ANY field is filled)

    const secondMember = formData.members[1];

    const isSecondMemberFilled =
      secondMember.name.trim() ||
      secondMember.regNo.trim() ||
      secondMember.email.trim();

    if (isSecondMemberFilled) {
      // If any field is filled, ALL fields must be filled

      if (
        !secondMember.name.trim() ||
        !secondMember.regNo.trim() ||
        !secondMember.email.trim()
      ) {
        setMessage(
          "Please complete all fields for Member 2 or leave all blank."
        );

        return false;
      }

      if (!validateEmail(secondMember.email)) {
        setMessage(
          "Member 2 email must be in the format: name.regNo@vitapstudent.ac.in"
        );

        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setLoading(true);

  // Filter out the second member if all their fields are empty
  const membersToRegister = formData.members.filter(
    (member) =>
      member.name.trim() || member.regNo.trim() || member.email.trim()
  );

  const dataToSend = {
    ...formData,
    members: membersToRegister,
  };

  try {
    console.log("Sending registration data:", dataToSend); // Debug log
    const response = await registerTeam(dataToSend);
    console.log("API Response:", response); // Debug log
    
    if (response.success) {
      console.log("Registration successful, redirecting to /student/verify-otp"); // Debug log
      // Navigate to verify-otp page with teamId and emails
      navigate("/student/verify-otp", {
        state: {
          teamId: response.teamId || response.data?.teamId,
          emails: response.emails || response.data?.emails,
        },
      });
    } else {
      console.log("Registration failed:", response.message); // Debug log
      setMessage(response.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error); // Debug log
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Registration failed. Please try again.";
    setMessage(errorMessage);
  } finally {
    setLoading(false);
  }
};

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

        .form-input,
        .form-textarea {
          background-color: rgba(255, 255, 255, 0.1);

          border: 1px solid rgba(255, 255, 255, 0.2);

          transition: all 0.3s ease-in-out;

          color: #fff;

          font-family: "Inter", sans-serif;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;

          border-color: #63b3ed;

          box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.5);
        }
      `}</style>

      <div className="max-w-3xl w-full">
        <div className="glass-form rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-extrabold text-center mb-2 text-white">
            Team Registration
          </h2>

          <p className="text-center text-gray-300 mb-8">
            Fill out the form below to register your team for the event.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Team Name */}

            <div className="space-y-4">
              <label
                htmlFor="teamName"
                className="block text-sm font-medium text-gray-300"
              >
                Team Name <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={(e) => handleChange(e, null, "team")}
                className="form-input w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            {/* Team Leader */}

            <div className="border-t border-gray-700 pt-8">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">
                Team Leader
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="leaderName"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    id="leaderName"
                    name="name"
                    value={formData.leader.name}
                    onChange={(e) => handleChange(e, null, "leader")}
                    className="form-input w-full px-4 py-2 rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="leaderRegNo"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Registration Number <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    id="leaderRegNo"
                    name="regNo"
                    value={formData.leader.regNo}
                    onChange={(e) => handleChange(e, null, "leader")}
                    className="form-input w-full px-4 py-2 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label
                  htmlFor="leaderEmail"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email Address <span className="text-red-400">*</span>
                </label>

                <input
                  type="email"
                  id="leaderEmail"
                  name="email"
                  value={formData.leader.email}
                  onChange={(e) => handleChange(e, null, "leader")}
                  className="form-input w-full px-4 py-2 rounded-lg"
                  placeholder="name.regNo@vitapstudent.ac.in"
                  required
                />

                <p className="text-xs text-gray-400">
                  Must be in the format: name.regNo@vitapstudent.ac.in
                </p>
              </div>
            </div>

            {/* Team Members */}

            <div className="border-t border-gray-700 pt-8">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">
                Team Members
              </h3>

              {/* Member 1 (Required) */}

              <div className="mb-6 p-6 glass-form rounded-lg">
                <h4 className="font-semibold text-gray-200 mb-3">
                  Member 1 <span className="text-red-400">*</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor={`member1Name`}
                      className="block text-sm font-medium text-gray-300"
                    >
                      Full Name <span className="text-red-400">*</span>
                    </label>

                    <input
                      type="text"
                      id={`member1Name`}
                      name="name"
                      value={formData.members[0].name}
                      onChange={(e) => handleChange(e, 0, "member")}
                      className="form-input w-full px-4 py-2 rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`member1RegNo`}
                      className="block text-sm font-medium text-gray-300"
                    >
                      Registration Number{" "}
                      <span className="text-red-400">*</span>
                    </label>

                    <input
                      type="text"
                      id={`member1RegNo`}
                      name="regNo"
                      value={formData.members[0].regNo}
                      onChange={(e) => handleChange(e, 0, "member")}
                      className="form-input w-full px-4 py-2 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label
                    htmlFor={`member1Email`}
                    className="block text-sm font-medium text-gray-300"
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="email"
                    id={`member1Email`}
                    name="email"
                    value={formData.members[0].email}
                    onChange={(e) => handleChange(e, 0, "member")}
                    className="form-input w-full px-4 py-2 rounded-lg"
                    placeholder="name.regNo@vitapstudent.ac.in"
                    required
                  />

                  <p className="text-xs text-gray-400">
                    Must be in the format: name.regNo@vitapstudent.ac.in
                  </p>
                </div>
              </div>

              {/* Member 2 (Optional) */}

              <div className="mb-6 p-6 glass-form rounded-lg">
                <h4 className="font-semibold text-gray-200 mb-3">
                  Member 2 (Optional)
                </h4>

                <p className="text-sm text-gray-400 mb-4">
                  Leave all fields blank if you're participating as a duo team.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor={`member2Name`}
                      className="block text-sm font-medium text-gray-300"
                    >
                      Full Name
                    </label>

                    <input
                      type="text"
                      id={`member2Name`}
                      name="name"
                      value={formData.members[1].name}
                      onChange={(e) => handleChange(e, 1, "member")}
                      className="form-input w-full px-4 py-2 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`member2RegNo`}
                      className="block text-sm font-medium text-gray-300"
                    >
                      Registration Number
                    </label>

                    <input
                      type="text"
                      id={`member2RegNo`}
                      name="regNo"
                      value={formData.members[1].regNo}
                      onChange={(e) => handleChange(e, 1, "member")}
                      className="form-input w-full px-4 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label
                    htmlFor={`member2Email`}
                    className="block text-sm font-medium text-gray-300"
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    id={`member2Email`}
                    name="email"
                    value={formData.members[1].email}
                    onChange={(e) => handleChange(e, 1, "member")}
                    className="form-input w-full px-4 py-2 rounded-lg"
                    placeholder="name.regNo@vitapstudent.ac.in"
                  />

                  {formData.members[1].email &&
                    !validateEmail(formData.members[1].email) && (
                      <p className="text-xs text-red-400">
                        Email must be in the format:
                        name.regNo@vitapstudent.ac.in
                      </p>
                    )}

                  {!formData.members[1].email && (
                    <p className="text-xs text-gray-400">
                      Must be in the format: name.regNo@vitapstudent.ac.in
                      (leave blank for duo team)
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Register Team"
              )}
            </button>
          </form>
        </div>
      </div>

      {message && (
        <MessageBox message={message} onClose={() => setMessage(null)} />
      )}
    </div>
  );
}
