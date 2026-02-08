const User = require('../models/User');

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
    try {
        const id_user = req.user.id_user;

        // We use the model that already handles the SELECT
        // and removes the password from the result
        const user = await User.findById(id_user);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({ success: true, data: user });

    } catch (error) {
        console.error("Profile Fetch Error:", error.message);
        res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
    try {
        const id_user = req.user.id_user;
        const { nom, telephone, adresse } = req.body;

        // [Security Check] Make sure at least one field is provided
        if (!nom && !telephone && !adresse) {
            return res.status(400).json({ message: "Aucune donnée fournie pour la mise à jour" });
        }

        // Use the model to update the data
        await User.update(id_user, { nom, telephone, adresse });

        res.status(200).json({ 
            success: true, 
            message: "Profil mis à jour avec succès" 
        });

    } catch (error) {
        console.error("Profile Update Error:", error.message);
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
    
        res.status(200).json({ success: true, message: "Liste des utilisateurs" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
