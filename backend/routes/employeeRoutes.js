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

router.get("/", verifyToken, getEmployees);
router.post("/", verifyToken, verifyAdmin, addEmployee);
router.get("/:id", verifyToken, getEmployee);
router.put("/:id", verifyToken, verifyAdmin, updateEmployee);
router.delete("/:id", verifyToken, verifyAdmin, deleteEmployee);

export default router;