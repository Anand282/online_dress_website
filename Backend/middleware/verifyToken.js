const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
    if (!token) return res.status(401).json({ success: false, message: 'Access Denied' });

    try {
        const decoded = jwt.verify(token, 'your_secret_key'); // Verify the token
        req.user = decoded; // Attach decoded user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid Token' });
    }
};

module.exports = verifyToken;