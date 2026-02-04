const Order = require('../models/Order');

/**
 * @desc    Créer une nouvelle commande
 * @route   POST /api/orders
 * @access  Private (User)
 */
exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const id_user = req.user.id_user; // جاية من الـ authMiddleware (JWT)

        // 1. [Security] تأكد بلي السلة ماشي خاوية
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                message: "Votre panier est vide ou le format des données est incorrect." 
            });
        }

        // 2. [Security & Business Logic]
        // كنعيطو لـ الموديل اللي فيه الـ Transaction. 
        // الثمن (totalAmount) كيتحسب لداخل فـ السيرفر لضمان الأمان.
        const orderId = await Order.createOrder(id_user, items);

        // 3. جواب السيرفر في حالة النجاح
        res.status(201).json({ 
            success: true,
            message: "Commande effectuée avec succès !", 
            orderId: orderId 
        });

    } catch (error) {
        // [Security] كنطلعو الخطأ فـ الـ Console ديالنا ولكن ما كنصيفطوش تفاصيل الداتابيز لـ المستخدم
        console.error("Erreur lors de la création de la commande:", error.message);
        res.status(500).json({ 
            message: "Une erreur est survenue lors du traitement de votre commande." 
        });
    }
};

/**
 * @desc    Récupérer l'historique des commandes de l'utilisateur
 * @route   GET /api/orders/my-orders
 * @access  Private (User)
 */
exports.getUserOrders = async (req, res) => {
    try {
        const id_user = req.user.id_user;

        // جلب الطلبيات باستعمال الموديل
        const orders = await Order.findByUser(id_user);

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
};