const db = require('../config/db'); 

// 1. Get All Categories
exports.getAllCategories = async (req, res) => {
    try {
        
        const [rows] = await db.execute('SELECT * FROM categorie');
        
       
        res.status(200).json(rows);
    } catch (error) {
        console.error("DATABASE ERROR:", error.message); 
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// 2. Get Category By ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const [category] = await db.query('SELECT * FROM categorie WHERE id_categorie = ?', [id]);
        if (category.length === 0) return res.status(404).json({ message: "Non trouvée" });
        res.status(200).json(category[0]);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 3. Create Category
exports.createCategory = async (req, res) => {
    try {
        const { nom_categorie, description } = req.body;
        const [result] = await db.query(
            "INSERT INTO `categorie` (nom_categorie, description) VALUES (?, ?)", 
            [nom_categorie, description || null]
        );
        res.status(201).json({ success: true, message: "Catégorie créée !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Category 
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_categorie, description } = req.body;
        await db.query(
            "UPDATE categorie SET nom_categorie = ?, description = ? WHERE id_categorie = ?",
            [nom_categorie, description, id]
        );
        res.status(200).json({ success: true, message: "Catégorie modifiée !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Delete Category 
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query("DELETE FROM categorie WHERE id_categorie = ?", [id]);
        
        res.status(200).json({ success: true, message: "Catégorie supprimée avec succès !" });
    } catch (error) {
        console.error("Delete Category Error:", error);
        
     
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                message: "Impossible de supprimer: Cette catégorie contient des produits. Supprimez les produits d'abord." 
            });
        }
        
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
};