import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

router.get("/admin-only", verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;