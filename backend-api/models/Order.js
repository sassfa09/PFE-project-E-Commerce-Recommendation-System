const db = require('../config/db'); 

const Order = {
  createOrder: async (id_user, items, type_paiement) => {
    const connection = await db.getConnection(); 
    try {
      await connection.beginTransaction();

    
      let totalAmount = 0;
      for (let item of items) {
        totalAmount += item.prix_unitaire * item.quantite;
      }

      const statut = (type_paiement === 'PayPal') ? 'payee' : 'en_attente';
      const [orderRes] = await connection.query(
        "INSERT INTO commande (id_user, montant_total, statut) VALUES (?, ?, ?)",
        [id_user, totalAmount, statut]
      );
      const orderId = orderRes.insertId;

     
      const ligneValues = items.map(item => [item.id_produit, orderId, item.quantite, item.prix_unitaire]);
      await connection.query(
        "INSERT INTO Ligne_Commande (id_produit, id_commande, quantite, prix_unitaire) VALUES ?",
        [ligneValues]
      );

      
      const payStatut = (type_paiement === 'PayPal') ? 'Completed' : 'Pending';
      await connection.query(
        "INSERT INTO paiement (id_commande, type_paiement, statut, date_paiement) VALUES (?, ?, ?, NOW())",
        [orderId, type_paiement, payStatut]
      );

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = Order;