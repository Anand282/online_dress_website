const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Mock admin data (replace with database queries in production)
const admin = {
    username: "admin",
    email: "admin@example.com",
    password: "$2a$10$ExampleHash" // Hashed password (use bcrypt to hash)
};

// Admin login route
router.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if admin exists
        if (username !== admin.username) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin.username, role: "admin" }, "your-secret-key", { expiresIn: "1h" });

        // Send success response
        res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: { email: admin.email }
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;