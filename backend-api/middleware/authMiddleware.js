const jwt = require('jsonwebtoken');

/**
 * Middleware to verify if the user is logged in (JWT Authentication)
 */
exports.auth = (req, res, next) => {
    // 1. Get token from the Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "No token, authorization denied" 
        });
    }

    try {
        // 3. Verify token using the secret from your .env file
        // Note: Using ACCESS_TOKEN_SECRET to match your .env file
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // 4. Add user data (id_user, role) to the request object
        req.user = decoded;
        
        next();
    } catch (err) {
        console.error("[AUTH ERROR]:", err.message);
        res.status(401).json({ 
            success: false, 
            message: "Token is not valid or expired" 
        });
    }
};

/**
 * Middleware to verify if the user has Admin privileges
 */
exports.adminMiddleware = (req, res, next) => {
    // Check if req.user exists (set by the auth middleware above)
    if (!req.user) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized. Please login first." 
        });
    }

    // Check if the user role is 'admin'
    // Ensure 'role' matches the column name in your 'client' table
    if (req.user.role !== 'admin') {
        console.log(`[ACCESS DENIED]: User ${req.user.id_user} tried to access admin route.`);
        return res.status(403).json({ 
            success: false, 
            message: "Access denied. Admin rights required." 
        });
    }

    // If everything is fine, proceed to the controller
    next();
};