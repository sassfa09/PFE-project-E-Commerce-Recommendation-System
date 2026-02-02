/**
 * TODO: Middleware to restrict access to Admins only.
 * 1. Check if the user object exists in 'req.user' (set by authMiddleware).
 * 2. Verify if 'req.user.role' is equal to 'admin'.
 * 3. If yes, call next().
 * 4. If no, return a 403 Forbidden status.
 */
module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admin rights required." });
    }
};