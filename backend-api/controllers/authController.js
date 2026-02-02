const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');


// ==========================================================
// REGISTER
// ==========================================================
exports.register = async (req, res) => {
    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: "Data is incomplete, please send the JSON body" 
            });
        }

        const { nom, email, mot_de_pass, telephone, adresse } = req.body;

        // Validation
        if (!nom || !email || !mot_de_pass) {
            return res.status(400).json({ 
                message: "Name, email, and password are required!" 
            });
        }

        // Check existing user
        const [existingUser] = await db.query(
            'SELECT * FROM client WHERE email = ?', 
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ 
                message: "This email is already in use!" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mot_de_pass, salt);

        // Insert user
        await db.query(
            'INSERT INTO client (nom, email, mot_de_pass, telephone, adresse) VALUES (?, ?, ?, ?, ?)',
            [nom, email, hashedPassword, telephone || null, adresse || null]
        );

        res.status(201).json({ 
            message: "Account created successfully!" 
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ 
            message: "An error occurred during registration" 
        });
    }
};



// ==========================================================
// LOGIN
// ==========================================================
exports.login = async (req, res) => {
    try {

        // 1. Receive email & password
        const { email, mot_de_pass } = req.body;

        if (!email || !mot_de_pass) {
            return res.status(400).json({ 
                message: "Please enter email and password" 
            });
        }

        // 2. Check if user exists
        const [users] = await db.query(
            'SELECT * FROM client WHERE email = ?', 
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        const user = users[0];

        // 3. Compare password
        const isMatch = await bcrypt.compare(
            mot_de_pass, 
            user.mot_de_pass
        );

        if (!isMatch) {
            return res.status(400).json({ 
                message: "Incorrect password" 
            });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { id: user.id_client },
            process.env.JWT_SECRET || 'pfe_secret_key_2026',
            { expiresIn: '24h' }
        );

        // 5. Send response
        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user.id_client,
                nom: user.nom,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ 
            message: "Server error" 
        });
    }
};

