import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const SESSION_NAME = process.env.SESSION_NAME || "login.sid";
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 24) {
  throw new Error("SESSION_SECRET must be set and contain at least 24 characters.");
}

app.disable("x-powered-by");
if (isProduction) app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "10kb" }));
app.use(session({
  name: SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: Math.floor(Number(process.env.SESSION_MAX_AGE_MS || 900000) / 1000)
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: Number(process.env.SESSION_MAX_AGE_MS || 900000)
  }
}));

app.get("/api/health", (_req, res) => res.json({ success: true, message: "API is running." }));
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, code: "SERVER_ERROR", message: "An unexpected server error occurred." });
});

connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)))
  .catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });
