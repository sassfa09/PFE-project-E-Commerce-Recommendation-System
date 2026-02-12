const db = require('../config/db'); // تأكد من مسار ملف الداتابيز عندك

// --- 1. جلب جميع الأصناف (موجودة عندك) ---
exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categorie');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// --- 2. جلب صنف واحد (موجودة عندك) ---
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

// --- 3. إضافة صنف جديد (هادي هي اللي خاصاك باش يتحيد الـ 500) ---
exports.createCategory = async (req, res) => {
    try {
        const { nom_categorie, description } = req.body;
        console.log("--- Payload reçu ---", req.body);

        // استعملنا Backticks باش نهربو من مشاكل السمية ديال الجدول
        const [result] = await db.query(
            "INSERT INTO `categorie` (nom_categorie, description) VALUES (?, ?)", 
            [nom_categorie, description || null]
        );

        console.log("--- Success DB ---", result);
        res.status(201).json({ message: "OK" });

    } catch (error) {
        // هاد السطور هما اللي غيقولو لينا واش المشكل من Docker أو SQL
        console.log("❌ ERROR TYPE:", error.code); 
        console.log("❌ ERROR MESSAGE:", error.message);
        
        res.status(500).json({ 
            error: error.message,
            code: error.code 
        });
    }
};