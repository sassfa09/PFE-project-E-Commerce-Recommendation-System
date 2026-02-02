const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const { montant_total, items } = req.body;
    const id_user = req.user.id_user; 

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Your cart is empty" });
    }

    let connection; // Declare connection outside to use it in catch/finally

    try {
        // Get a connection from the pool
        connection = await db.getConnection();

        // Start Transaction
        await connection.beginTransaction();

        // 1. Insert into 'commande' table
        const [orderResult] = await connection.query(
            'INSERT INTO commande (id_user, montant_total, statut) VALUES (?, ?, ?)',
            [id_user, montant_total, 'en_attente']
        );

        const id_commande = orderResult.insertId;

        // 2. Insert items into 'Ligne_Commande'
        for (const item of items) {
            await connection.query(
                'INSERT INTO Ligne_Commande (id_produit, id_commande, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
                [item.id_produit, id_commande, item.quantite, item.prix_unitaire]
            );
        }

        // 3. Commit
        await connection.commit();

        res.status(201).json({ 
            message: "Order placed successfully", 
            orderId: id_commande 
        });

    } catch (error) {
        // Rollback if something goes wrong
        if (connection) await connection.rollback();
        console.error("Order Transaction Error:", error);
        res.status(500).json({ message: "Failed to place order" });
    } finally {
        // Release the connection back to the pool
        if (connection) connection.release();
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM commande WHERE id_user = ? ORDER BY date_commande DESC',
            [req.user.id_user]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};