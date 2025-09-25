import jwt from "jsonwebtoken";

// Auth middleware: verifies JWT from header and attaches user info to req.user
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