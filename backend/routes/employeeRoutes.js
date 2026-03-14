import express from "express";
import {
  getEmployees,
  addEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require admin
router.get("/", verifyToken, verifyAdmin, getEmployees);
router.post("/", verifyToken, verifyAdmin, addEmployee);
router.get("/:id", verifyToken, verifyAdmin, getEmployee);
router.put("/:id", verifyToken, verifyAdmin, updateEmployee);
router.delete("/:id", verifyToken, verifyAdmin, deleteEmployee);

export default router;