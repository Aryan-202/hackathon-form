const Team = require('../models/Team');
const OTP = require('../models/OTP');
const { sendEmail } = require('../config/mailer');
const generateOTP = require('../utils/generateOTP');
const exportTeamsToExcel = require('../utils/exportExcel');

// Email validation regex for VIT-AP students
const VITAP_EMAIL_REGEX = /^[a-zA-Z]+\.[a-zA-Z0-9]+@vitapstudent\.ac\.in$/;

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { teamName, leader, members } = req.body;

    // Validate required fields
    if (!teamName || !leader || !members) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate team size (min 2, max 3 including leader)
    if (members.length < 1 || members.length > 2) {
      return res.status(400).json({ message: 'Team must have 2-3 members' });
    }

    // Validate VIT-AP email format for leader
    if (!VITAP_EMAIL_REGEX.test(leader.email)) {
      return res.status(400).json({ message: 'Leader email must be in VIT-AP format: name.regNo@vitapstudent.ac.in' });
    }

    // Validate VIT-AP email format for all members
    for (const member of members) {
      if (!VITAP_EMAIL_REGEX.test(member.email)) {
        return res.status(400).json({ 
          message: `Member email ${member.email} must be in VIT-AP format: name.regNo@vitapstudent.ac.in` 
        });
      }
    }

    // Check if leader is already in any team
    const existingLeader = await Team.findOne({
      $or: [
        { 'leader.email': leader.email },
        { 'members.email': leader.email }
      ]
    });

    if (existingLeader) {
      return res.status(400).json({ message: 'Leader is already part of a team' });
    }

    // Check if any member is already in any team
    for (const member of members) {
      const existingMember = await Team.findOne({
        $or: [
          { 'leader.email': member.email },
          { 'members.email': member.email }
        ]
      });

      if (existingMember) {
        return res.status(400).json({ message: `Member ${member.email} is already part of a team` });
      }
    }

    // Check if team name is already taken
    const existingTeam = await Team.findOne({ teamName: { $regex: new RegExp(`^${teamName}$`, 'i') } });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name is already taken' });
    }

    // Create team with unverified members
    const team = new Team({
      teamName,
      leader,
      members: members.map(member => ({ ...member, verified: false })),
    });

    const savedTeam = await team.save();

    // Send OTPs to all members
    for (const member of members) {
      const otpCode = generateOTP();
      
      const otp = new OTP({
        email: member.email,
        otp: otpCode,
        teamId: savedTeam._id,
      });

      await otp.save();

      // Send email with OTP
      const emailSubject = 'Hackathon Team Invitation';
      const emailHtml = `
        <h2>Hackathon Team Invitation</h2>
        <p>You have been invited to join team "${teamName}" for the hackathon.</p>
        <p>Your OTP for verification is: <strong>${otpCode}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `;

      await sendEmail(member.email, emailSubject, emailHtml);
    }

    res.status(201).json({
      message: 'Team created successfully. OTPs sent to team members for verification.',
      teamId: savedTeam._id,
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error while creating team' });
  }
};

// Get all teams (for admin)
const getAllTeams = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { 'leader.name': { $regex: search, $options: 'i' } },
        { 'leader.regNo': { $regex: search, $options: 'i' } },
        { 'leader.email': { $regex: search, $options: 'i' } },
        { 'members.name': { $regex: search, $options: 'i' } },
        { 'members.regNo': { $regex: search, $options: 'i' } },
        { 'members.email': { $regex: search, $options: 'i' } },
      ];
    }

    const teams = await Team.find(filter).sort({ createdAt: -1 });
    res.status(200).json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Server error while fetching teams' });
  }
};

// Get team by ID
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error while fetching team' });
  }
};

// Update team status (qualify for round 2)
const updateTeamStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['registered', 'qualified'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const team = await Team.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ message: 'Team status updated successfully', team });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ message: 'Server error while updating team' });
  }
};

// Export teams to Excel
const exportTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    const buffer = await exportTeamsToExcel(teams);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=teams.xlsx');
    
    res.send(buffer);
  } catch (error) {
    console.error('Export teams error:', error);
    res.status(500).json({ message: 'Server error while exporting teams' });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeamStatus,
  exportTeams,
};