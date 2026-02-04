const Category = require('../models/Category');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
exports.getAllCategories = async (req, res) => {
    try {
        // Fetch all categories from the model
        const categories = await Category.findAll();

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ 
            message: "Erreur lors de la récupération des catégories" 
        });
    }
};

/**
 * @desc    Get single category details
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const exists = await Category.exists(id);

        if (!exists) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        // Here you can add a query to fetch the category details if needed
        res.status(200).json({ success: true, message: "Catégorie valide" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
