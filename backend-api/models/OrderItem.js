const db = require('../config/db');

const OrderItem = {
// 1. Add order items (Batch Insert)
  // This method is the fastest and most secure against SQL Injection
  addItems: async (connection, orderId, items) => {
// Filter the data to make sure we only send required numeric values 
    const values = items.map(item => [
      orderId, 
      item.id_product, 
      item.quantity, 
      item.price
    ]);

    const sql = 'INSERT INTO order_items (id_order, id_product, quantity, price) VALUES ?';
    
      // Use the connection coming from the Order transaction
    return await connection.query(sql, [values]);
  },


  // 2. Fetch details of a specific order with product information (Join)
  // This query also retrieves the product name and image to display on the Frontend
  findByOrderId: async (orderId) => {
    const sql = `
      SELECT 
        oi.id_product, 
        oi.quantity, 
        oi.price, 
        p.designation, 
        p.image_url 
      FROM order_items oi
      JOIN product p ON oi.id_product = p.id_product
      WHERE oi.id_order = ?
    `;
    const [rows] = await db.query(sql, [orderId]);
    return rows;
  }
};

module.exports = OrderItem;