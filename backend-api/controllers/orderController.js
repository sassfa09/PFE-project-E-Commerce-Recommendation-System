const Order = require('../models/Order');
const db = require('../config/db');

/**
 * @desc    Créer une nouvelle commande
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, type_paiement } = req.body; 
        // استعملي نفس السمية اللي خدامة عندك ف الـ Token (غالبا id_user)
        const id_user = req.user.id_user || req.user.id; 

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Votre panier est vide." });
        }

        const orderId = await Order.createOrder(id_user, items, type_paiement);

        res.status(201).json({ 
            success: true,
            message: "Commande effectuée avec succès !", 
            orderId: orderId 
        });

    } catch (error) {
        console.error("Erreur commande:", error.message);
        res.status(500).json({ message: "Erreur serveur lors de la création." });
    }
};

/**
 * @desc    Récupérer l'historique des commandes (Version corrigée)
 */
exports.getUserOrders = async (req, res) => {
    try {
        // تأكدي أن الـ Token كيعطينا id_user
        const id_user = req.user.id_user || req.user.id;

        if (!id_user) {
            return res.status(401).json({ message: "Utilisateur non identifié." });
        }

        // التعديل هنا: جدول commande، عمود id_user، وعمود montant_total
        const [orders] = await db.query(
            "SELECT id_commande, date_commande, statut, montant_total FROM commande WHERE id_user = ? ORDER BY date_commande DESC",
            [id_user]
        );

        res.status(200).json(orders);
        
    } catch (error) {
        console.error("Erreur SQL:", error.message);
        res.status(500).json({ message: "Erreur serveur: " + error.message });
    }
};