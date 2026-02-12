const db = require('../config/db');

// 1. Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const query = `
            SELECT p.*, pi.img_url 
            FROM product p
            LEFT JOIN Product_Images pi ON p.id_product = pi.prod_ID
            ORDER BY p.id_product DESC
        `;
        const [products] = await db.execute(query);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Create Product
exports.createProduct = async (req, res) => {
    try {
        const { nom_produit, id_categorie, prix, stock } = req.body;
        const image_url = req.file ? `uploads/${req.file.filename}` : null;

        const [result] = await db.execute(
            "INSERT INTO product (id_categorie, nom_produit, prix, stock) VALUES (?, ?, ?, ?)",
            [id_categorie, nom_produit, prix, stock]
        );

        if (image_url) {
            await db.execute(
                "INSERT INTO Product_Images (prod_ID, img_url) VALUES (?, ?)",
                [result.insertId, image_url]
            );
        }
        res.status(201).json({ success: true, message: "Produit créé !" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Delete Product 
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM product WHERE id_product = ?", [id]);
        res.status(200).json({ success: true, message: "Produit supprimé !" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Update Product 
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_produit, id_categorie, prix, stock } = req.body;

        await db.execute(
            "UPDATE product SET nom_produit=?, id_categorie=?, prix=?, stock=? WHERE id_product=?",
            [nom_produit, id_categorie, prix, stock, id]
        );

        if (req.file) {
            const image_url = `uploads/${req.file.filename}`;
           
            await db.execute("DELETE FROM Product_Images WHERE prod_ID = ?", [id]);
            await db.execute("INSERT INTO Product_Images (prod_ID, img_url) VALUES (?, ?)", [id, image_url]);
        }

        res.status(200).json({ success: true, message: "Produit modifié !" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Get Product By ID
exports.getProductById = async (req, res) => {
    try {
        const [products] = await db.execute("SELECT * FROM product WHERE id_product = ?", [req.params.id]);
        if (products.length === 0) return res.status(404).json({ message: "Non trouvé" });
        res.json({ success: true, data: products[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Get Products By Category
exports.getProductsByCategory = async (req, res) => {
    try {
        const [products] = await db.execute("SELECT * FROM product WHERE id_categorie = ?", [req.params.id]);
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};