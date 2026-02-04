module.exports = (req, res, next) => {
    // User not logged in
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    // User logged in but not admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin rights required." });
    }

    // User is admin → allow access
    next();
};

