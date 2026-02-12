const db = require('../config/db'); 


exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categorie');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


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

exports.createCategory = async (req, res) => {
    try {
        const { nom_categorie, description } = req.body;
        console.log("--- Payload reçu ---", req.body);

        const [result] = await db.query(
            "INSERT INTO `categorie` (nom_categorie, description) VALUES (?, ?)", 
            [nom_categorie, description || null]
        );

        console.log("--- Success DB ---", result);
        res.status(201).json({ message: "OK" });

    } catch (error) {
       
        console.log(" ERROR TYPE:", error.code); 
        console.log(" ERROR MESSAGE:", error.message);
        
        res.status(500).json({ 
            error: error.message,
            code: error.code 
        });
    }
};