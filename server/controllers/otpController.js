const OTP = require('../models/OTP');
const Team = require('../models/Team');

// Verify OTP for team member
const verifyOTP = async (req, res) => {
  try {
    const { teamId, otpValues } = req.body;

    if (!teamId || !otpValues || typeof otpValues !== 'object') {
      return res.status(400).json({ message: 'Team ID and OTP values are required' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const verificationResults = [];
    
    // Verify each OTP
    for (const [email, otp] of Object.entries(otpValues)) {
      if (!otp) continue; // Skip if no OTP provided
      
      const otpRecord = await OTP.findOne({ email, otp, teamId });

      if (!otpRecord) {
        verificationResults.push({ email, success: false, message: 'Invalid OTP' });
        continue;
      }

      if (otpRecord.expiresAt < new Date()) {
        await OTP.findByIdAndDelete(otpRecord._id);
        verificationResults.push({ email, success: false, message: 'OTP expired' });
        continue;
      }

      // Update member verification status
      const memberIndex = team.members.findIndex(m => m.email === email);
      if (memberIndex !== -1) {
        team.members[memberIndex].verified = true;
        verificationResults.push({ email, success: true, message: 'OTP verified' });
      }

      // Delete used OTP
      await OTP.findByIdAndDelete(otpRecord._id);
    }

    await team.save();

    // Check if any verifications failed
    const failedVerifications = verificationResults.filter(result => !result.success);
    
    if (failedVerifications.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some OTPs failed verification',
        results: verificationResults
      });
    }

    res.status(200).json({
      success: true,
      message: 'All OTPs verified successfully',
      team
    });
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