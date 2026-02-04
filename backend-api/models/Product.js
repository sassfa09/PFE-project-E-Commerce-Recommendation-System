const db = require('../config/db');

const Product = {

  findAllActive: async () => {
    const [rows] = await db.query('SELECT * FROM product WHERE stock > 0');
    return rows;
  },

  findById: async (id) => {
    
    const [rows] = await db.query('SELECT * FROM product WHERE id_product = ?', [id]);
    return rows[0];
  },

  
  create: async (productData) => {
    const { designation, prix, stock, id_category, image_url } = productData;
    const [result] = await db.query(
      'INSERT INTO product (designation, prix, stock, id_category, image_url) VALUES (?, ?, ?, ?, ?)',
      [designation, prix, stock, id_category, image_url]
    );
    return result.insertId;
  },
 findByCategory:  async (categoryId) => {
    const [rows] = await db.query(
        'SELECT * FROM product WHERE id_category = ? AND stock > 0', 
        [categoryId]
    );
    return rows;
}
};



module.exports = Product;