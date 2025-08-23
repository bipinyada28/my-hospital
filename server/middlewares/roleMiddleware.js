// server/middlewares/roleMiddleware.js
export default function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.role || !allowed.includes(req.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
