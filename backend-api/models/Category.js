const db = require('../config/db');

const Category = {
  
  findAll: async () => {
    
    const [rows] = await db.query("SELECT * FROM categorie");
    return rows;
  },


  exists: async (id) => {
    const [rows] = await db.query("SELECT * FROM categorie WHERE id_categorie = ?", [id]);
    return rows.length > 0;
  }
};

module.exports = Category;