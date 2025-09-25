// middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Authentication middleware
 * Validates JWT token from Authorization header ("Bearer <token>")
 * and attaches decoded user data to req.user
 */
export default function auth(req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains at least user ID
    
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}