const OTP = require('../models/OTP');
const Team = require('../models/Team');

// Verify OTP for team member
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Update team member verification status
    const team = await Team.findById(otpRecord.teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const memberIndex = team.members.findIndex(m => m.email === email);
    if (memberIndex === -1) {
      return res.status(404).json({ message: 'Member not found in team' });
    }

    team.members[memberIndex].verified = true;
    await team.save();

    // Delete used OTP
    await OTP.findByIdAndDelete(otpRecord._id);

    // Check if all members are verified
    const allVerified = team.members.every(m => m.verified);
    const message = allVerified 
      ? 'OTP verified successfully. All team members are now verified.' 
      : 'OTP verified successfully. Waiting for other members to verify.';

    res.status(200).json({ message, team });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find team by member email
    const team = await Team.findOne({ 'members.email': email });
    if (!team) {
      return res.status(404).json({ message: 'Team not found for this email' });
    }

    // Check if member is already verified
    const member = team.members.find(m => m.email === email);
    if (member.verified) {
      return res.status(400).json({ message: 'Member is already verified' });
    }

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Generate new OTP
    const generateOTP = require('../utils/generateOTP');
    const otpCode = generateOTP();
    
    const otp = new OTP({
      email,
      otp: otpCode,
      teamId: team._id,
    });

    await otp.save();

    // Send email with new OTP
    const { sendEmail } = require('../config/mailer');
    const emailSubject = 'Hackathon Team Invitation - New OTP';
    const emailHtml = `
      <h2>Hackathon Team Invitation</h2>
      <p>Your new OTP for verification is: <strong>${otpCode}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
    `;

    await sendEmail(email, emailSubject, emailHtml);

    res.status(200).json({ message: 'New OTP sent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error while resending OTP' });
  }
};

module.exports = {
  verifyOTP,
  resendOTP,
};