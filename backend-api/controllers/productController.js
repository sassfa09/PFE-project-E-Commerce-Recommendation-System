const db = require('../config/db');


// ==========================================================
// 1. Get All Products
// ==========================================================
exports.getAllProducts = async (req, res) => {
    try {

        const [rows] = await db.query(
            'SELECT * FROM product'
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products" });
    }
};


// ==========================================================
// 2. Get Product By ID
// ==========================================================
exports.getProductById = async (req, res) => {
    try {

        const { id } = req.params;

        const [rows] = await db.query(
            'SELECT * FROM product WHERE id_product = ?', 
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ 
                message: "Product not found" 
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching product details" });
    }
};


// ==========================================================
// 3. Add Product
// ==========================================================
exports.addProduct = async (req, res) => {
    try {

        const { name, price, stock, category } = req.body;

        if (!name || !price) {
            return res.status(400).json({ 
                message: "Name and price are required" 
            });
        }

        await db.query(
            'INSERT INTO product (name, price, stock, category) VALUES (?, ?, ?, ?)',
            [name, price, stock || 0, category || null]
        );

        res.status(201).json({ 
            message: "Product added successfully" 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding product" });
    }
};

