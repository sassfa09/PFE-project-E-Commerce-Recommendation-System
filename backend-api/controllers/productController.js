const Product = require('../models/Product');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAllActive();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ message: "Erreur lors de la récupération des produits" });
    }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
exports.createProduct = async (req, res) => {
    try {
        // [Security] الـ Data كتجينا من الـ Admin
        const { designation, prix, stock, id_category, image_url } = req.body;

        // التحقق من البيانات الأساسية
        if (!designation || !prix || !id_category) {
            return res.status(400).json({ message: "Veuillez remplir les champs obligatoires" });
        }

        const productId = await Product.create({
            designation,
            prix,
            stock: stock || 0,
            id_category,
            image_url
        });

        res.status(201).json({
            success: true,
            message: "Produit ajouté avec succès",
            productId
        });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: "Erreur lors de l'ajout du produit" });
    }
};
/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:id
 * @access  Public
 */
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

       
        if (isNaN(categoryId)) {
            return res.status(400).json({ message: "ID de catégorie invalide" });
        }

        const products = await Product.findByCategory(categoryId);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error("Error fetching products by category:", error.message);
        res.status(500).json({ message: "Erreur serveur lors du filtrage" });
    }
};