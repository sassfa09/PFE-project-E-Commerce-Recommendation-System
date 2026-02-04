const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const id_user = req.user.id_user;

        const [rows] = await db.query(
            `SELECT id_user, nom, email, telephone, adresse 
             FROM client 
             WHERE id_user = ?`,
            [id_user]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};



exports.updateProfile = async (req, res) => {
    try {
        const id_user = req.user.id_user;
        const { nom, telephone, adresse } = req.body;

        // Optional: check if at least one field is provided
        if (!nom && !telephone && !adresse) {
            return res.status(400).json({ message: "No data provided to update" });
        }

        // Update query
        await db.query(
            `UPDATE client 
             SET nom = ?, telephone = ?, adresse = ?
             WHERE id_user = ?`,
            [nom, telephone, adresse, id_user]
        );

        res.json({ message: "Profile updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error updating profile" });
    }
};

