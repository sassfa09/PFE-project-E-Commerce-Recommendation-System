const db = require('../config/db');

/**
 * TODO: Get the current logged-in user's profile.
 * 1. Get 'id_user' from 'req.user'.
 * 2. Execute SELECT on 'client' table.
 * 3. IMPORTANT: Do NOT return the 'mot_de_pass' field for security.
 */
exports.getProfile = async (req, res) => {
    try {
        // Write the SQL query to find user by id_user
    } catch (error) {
        res.status(500).json({ message: "Server error fetching profile" });
    }
};

/**
 * TODO: Update user information (Optional/Bonus).
 * Update fields like 'nom', 'telephone', or 'adresse' in the 'client' table.
 */
exports.updateProfile = async (req, res) => {
    // Implement UPDATE logic here
};