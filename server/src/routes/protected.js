import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";

const router = Router();

router.get("/dashboard", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({
        success: false, code: "SESSION_EXPIRED", message: "Please log in again."
      });
    }
    res.json({
      success: true,
      message: "You have accessed a protected resource.",
      data: {
        title: "Secure Dashboard",
        user: { id: user._id, name: user.name, email: user.email },
        serverTime: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
