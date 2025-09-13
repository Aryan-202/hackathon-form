const express = require('express');
const {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeamStatus,
  exportTeams,
} = require('../controllers/teamController');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/', createTeam);
router.get('/:id', getTeamById);

// Admin routes (protected)
router.get('/', verifyToken, getAllTeams);
router.patch('/:id/status', verifyToken, updateTeamStatus);
router.get('/export/excel', verifyToken, exportTeams);

module.exports = router;