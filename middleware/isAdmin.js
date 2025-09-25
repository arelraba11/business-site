// Middleware to check if the user has admin privileges

const isAdmin = (req, res, next) => {
  // Validate that the user is logged in and has the admin role
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }
  next();
};

export default isAdmin;