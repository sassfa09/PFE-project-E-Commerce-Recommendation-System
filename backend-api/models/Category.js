const db = require('../config/db');

const Category = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM category ORDER BY nom_category ASC');
    return rows;
  },
  
   // Make sure the section exists before linking products to it
 
  exists: async (id) => {
    const [rows] = await db.query('SELECT id_category FROM category WHERE id_category = ?', [id]);
    return rows.length > 0;
  }
};

module.exports = Category;