import { Router } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

const registrationRules = [
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must contain 2 to 60 characters."),
  body("email").trim().isEmail().withMessage("Enter a valid email address."),
  body("password").isLength({ min: 8, max: 72 }).withMessage("Password must contain at least 8 characters.")
];

const loginRules = [
  body("email").trim().isEmail().withMessage("Enter a valid email address."),
  body("password").isLength({ min: 1, max: 72 }).withMessage("Password is required.")
];

function sendValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Please correct the highlighted fields.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

router.post("/register", registrationRules, sendValidationErrors, async (req, res, next) => {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false, code: "EMAIL_EXISTS", message: "An account with this email already exists."
      });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({ name, email, passwordHash });
    return res.status(201).json({ success: true, message: "Registration successful. You can now log in.", user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, code: "EMAIL_EXISTS", message: "An account with this email already exists." });
    }
    next(error);
  }
});

router.post("/login", loginRules, sendValidationErrors, async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email }).select("+passwordHash");
    const valid = user && await bcrypt.compare(req.body.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        success: false, code: "INVALID_CREDENTIALS", message: "Invalid email or password."
      });
    }

    // Regenerate the session ID after authentication to reduce session-fixation risk.
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.userId = user._id.toString();
      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        return res.json({ success: true, message: "Login successful.", user: publicUser(user) });
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ success: false, code: "SESSION_EXPIRED", message: "Session user no longer exists." });
    }
    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res, next) => {
  if (!req.session) return res.json({ success: true, message: "Logged out." });
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie(process.env.SESSION_NAME || "login.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE === "true"
    });
    res.json({ success: true, message: "Logged out successfully." });
  });
});

export default router;
