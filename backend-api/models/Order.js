const db = require('../config/db');

const Order = {

  createOrder: async (userId, totalAmount, items) => {
    const connection = await db.getConnection(); 
    try {
      await connection.beginTransaction(); 

    
      const [orderResult] = await connection.query(
        'INSERT INTO orders (id_user, total_amount, status, created_at) VALUES (?, ?, "pending", NOW())',
        [userId, totalAmount]
      );
      const orderId = orderResult.insertId;

      
      const itemValues = items.map(item => [orderId, item.id_product, item.quantity, item.price]);
      await connection.query(
        'INSERT INTO order_items (id_order, id_product, quantity, price) VALUES ?',
        [itemValues]
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
