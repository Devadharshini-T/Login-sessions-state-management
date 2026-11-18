export function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({
      success: false,
      code: "SESSION_EXPIRED",
      message: "Your session is missing or has expired. Please log in again."
    });
  }
  next();
}
