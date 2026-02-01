const db = require('../config/db');

// TODO: 1. Fetch all products from the database
// Steps:
// - Use db.query to retrieve all rows from the 'product' table
// - Send the result (rows) as JSON to Postman
// - Use try/catch to handle errors
exports.getAllProducts = async (req, res) => {
    try {
        // Write the code here...
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
};

// TODO: 2. Fetch a single product using the ID
// Steps:
// - Get the ID from req.params
// - Do SELECT * from the product table where id_product equals the ID
// - If the product is not found, send 404
exports.getProductById = async (req, res) => {
    try {
        // Write the code here...
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details" });
    }
};

// TODO: 3. Add a new product (Admin)
// Steps:
// - Get (name, price, stock, category, ...) from req.body
// - Do INSERT INTO the product table
// - Send a success message with status 201
exports.addProduct = async (req, res) => {
    try {
        // Write the code here...
    } catch (error) {
        res.status(500).json({ message: "Error adding product" });
    }
};
