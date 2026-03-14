import express from "express";
import {
  getLeaves,
  applyLeave,
  getLeaveById,
  updateLeaveStatus,
  getEmployeeLeaves
} from "../controllers/leaveController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes - view and manage all leaves
router.get("/", verifyToken, verifyAdmin, getLeaves);
router.get("/:id", verifyToken, getLeaveById);
router.put("/:id", verifyToken, verifyAdmin, updateLeaveStatus);

// Employee routes - apply for leave and view own leaves
router.post("/apply", verifyToken, applyLeave);
router.get("/employee/:employeeId", verifyToken, getEmployeeLeaves);

export default router;