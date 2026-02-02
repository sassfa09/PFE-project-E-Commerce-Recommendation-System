// ==========================================================
// TODO:  Login Implementation
// ==========================================================
// 1. Receive 'email' and 'mot_de_pass' from req.body
// 2. Check if the user exists in the 'client' table using email
// 3. If user exists, compare the provided password with the Hashed password in DB
//    (Hint: Use bcrypt.compare())
// 4. If password matches, generate a JWT Token for the user
// 5. Send back the Token and basic User info as a JSON response
// ==========================================================
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// --- Register Logic ---
exports.register = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Data is incomplete" });
        }
        const { nom, email, mot_de_pass, telephone, adresse } = req.body;

        if (!nom || !email || !mot_de_pass) {
            return res.status(400).json({ message: "Name, email, and password are required!" });
        }

        const [existingUser] = await db.query('SELECT * FROM client WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "This email is already in use!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mot_de_pass, salt);

        await db.query(
            'INSERT INTO client (nom, email, mot_de_pass, telephone, adresse) VALUES (?, ?, ?, ?, ?)',
            [nom, email, hashedPassword, telephone || null, adresse || null]
        );

        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// --- Login Logic ---
exports.login = async (req, res) => {
    try {
        const { email, mot_de_pass } = req.body;

        if (!email || !mot_de_pass) {
            return res.status(400).json({ message: "Please enter email and password" });
        }

        const [users] = await db.query('SELECT * FROM client WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(mot_de_pass, user.mot_de_pass);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate JWT using the correct secret from your .env
        const token = jwt.sign(
            { id_user: user.id_user, role: user.role }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful!",
            token,
            user: { id: user.id_user, nom: user.nom, email: user.email }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};