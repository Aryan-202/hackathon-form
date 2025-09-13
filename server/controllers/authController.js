const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await admin.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Admin Logout - FIXED
const logoutAdmin = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    
    // Verify admin still exists
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(401).json({ message: "Admin no longer exists" });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Get admin error:", error);
    res.status(500).json({ message: "Server error while fetching admin data" });
  }
};

module.exports = { loginAdmin, logoutAdmin, verifyToken, getCurrentAdmin };