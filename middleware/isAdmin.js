// Check if user is admin
const isAdmin = (req, res, next) => {
  // Allow only admins
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }
  next();
};

export default isAdmin;