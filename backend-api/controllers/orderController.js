const db = require('../config/db');

/**
 * @desc    1. Créer une nouvelle commande
 */
exports.createOrder = async (req, res) => {
    try {
        const { type_paiement, items } = req.body;
        // id_user comes from the decoded token in authMiddleware
        const id_user = req.user.id_user;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Le panier est vide" });
        }

        // Calculate total
        const montant_total = items.reduce(
            (sum, item) => sum + (item.prix_unitaire * item.quantite),
            0
        );

        // Initial status
        const statut_commande = (type_paiement === 'PayPal') ? 'payee' : 'en_attente';

        // A. Insert into "commande" table
        const [orderResult] = await db.query(
            "INSERT INTO commande (id_user, montant_total, statut) VALUES (?, ?, ?)",
            [id_user, montant_total, statut_commande]
        );

        const id_commande = orderResult.insertId;

        // B. Insert into "Ligne_Commande" table
        const detailQueries = items.map(item => {
            return db.query(
                "INSERT INTO Ligne_Commande (id_produit, id_commande, quantite, prix_unitaire) VALUES (?, ?, ?, ?)",
                [item.id_produit, id_commande, item.quantite, item.prix_unitaire]
            );
        });
        await Promise.all(detailQueries);

        // C. Insert into "paiement" table (matching your SQL schema)
        await db.query(
            "INSERT INTO paiement (id_commande, type_paiement, statut) VALUES (?, ?, ?)",
            [id_commande, type_paiement, statut_commande]
        );

        // D. Update stock in "product" table
        const stockQueries = items.map(item => {
            return db.query(
                "UPDATE product SET stock = stock - ? WHERE id_product = ?",
                [item.quantite, item.id_produit]
            );
        });
        await Promise.all(stockQueries);

        res.status(201).json({
            success: true,
            message: "Commande créée avec succès",
            id_commande: id_commande
        });

    } catch (error) {
        console.error("Error in createOrder:", error.message);
        res.status(500).json({ message: "Erreur lors de la création", error: error.message });
    }
};

/**
 * @desc    2. Get all orders (ADMIN ONLY) - FIXED SQL
 */
exports.getAllOrders = async (req, res) => {
    try {
        // We join 'commande' with 'client' for names and 'paiement' for the method
        const [orders] = await db.query(`
            SELECT 
                c.id_commande, 
                c.date_commande, 
                c.statut, 
                c.montant_total,
                cl.nom AS client_name, 
                cl.email AS client_email,
                p.type_paiement
            FROM commande c
            JOIN client cl ON c.id_user = cl.id_user
            LEFT JOIN paiement p ON c.id_commande = p.id_commande
            ORDER BY c.date_commande DESC
        `);

        res.status(200).json(orders);
    } catch (error) {
        console.error("SQL Error in getAllOrders:", error.message);
        res.status(500).json({ message: "Erreur serveur: " + error.message });
    }
};

/**
 * @desc    3. Get user's order history
 */
exports.getUserOrders = async (req, res) => {
    try {
        const id_user = req.user.id_user;
        const [orders] = await db.query(
            `SELECT c.*, p.type_paiement 
             FROM commande c 
             LEFT JOIN paiement p ON c.id_commande = p.id_commande 
             WHERE c.id_user = ? 
             ORDER BY c.date_commande DESC`,
            [id_user]
        );
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    4. Update order status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body; // en_attente, payee, expediee, livree, annulee
        
        await db.query(
            "UPDATE commande SET statut = ? WHERE id_commande = ?",
            [statut, id]
        );
        
        res.status(200).json({ success: true, message: "Statut mis à jour" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const [items] = await db.query(`
            SELECT lc.*, p.nom_produit 
            FROM Ligne_Commande lc
            JOIN product p ON lc.id_produit = p.id_product
            WHERE lc.id_commande = ?
        `, [id]);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};