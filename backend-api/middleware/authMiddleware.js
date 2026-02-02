const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        // Verify using the same secret key from .env
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Attach the user data (id_user, role) to the request object
        req.user = decoded; 
        next(); 
    } catch (ex) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};