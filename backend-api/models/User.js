const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
 
  create: async (userData) => {
    const { nom, email, password, telephone, adresse } = userData;
    
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO client (nom, email, password, telephone, adresse, role) VALUES (?, ?, ?, ?, ?, "user")',
      [nom, email, hashedPassword, telephone, adresse]
    );
    return result.insertId;
  },


  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT id_user, nom, email, telephone, adresse, role FROM client WHERE id_user = ?', 
      [id]
    );
    return rows[0];
  },

 
  findByEmailWithPassword: async (email) => {
    const [rows] = await db.query('SELECT * FROM client WHERE email = ?', [email]);
    return rows[0];
  },

 
  comparePassword: async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
};

module.exports = User;