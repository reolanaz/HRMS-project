import express from "express";
import { 
  getDepartments, 
  addDepartment, 
  updateDepartment, 
  deleteDepartment 
} from "../controllers/departmentController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require admin access
router.get("/", verifyToken, verifyAdmin, getDepartments);
router.post("/", verifyToken, verifyAdmin, addDepartment);
router.put("/:id", verifyToken, verifyAdmin, updateDepartment);
router.delete("/:id", verifyToken, verifyAdmin, deleteDepartment);

export default router;