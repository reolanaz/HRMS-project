import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Leave from "../models/Leave.js";

const router = express.Router();

router.post("/apply", verifyToken, async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ─── 1. Basic field validation ───────────────────────────
    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // ─── 2. Reason minimum length ────────────────────────────
    if (reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Reason must be at least 10 characters long"
      });
    }

    // ─── 3. End date must be after start date ────────────────
    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date"
      });
    }

    // ─── 4. Cannot apply for past dates ──────────────────────
    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot apply for leave on past dates"
      });
    }

    // ─── 5. Calculate days ───────────────────────────────────
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // ─── 6. Notice period validation ─────────────────────────
    const noticeDays = Math.ceil((start - today) / (1000 * 60 * 60 * 24));

    if (leaveType === "Casual" && noticeDays < 1) {
      return res.status(400).json({
        success: false,
        message: "Casual Leave requires at least 1 day advance notice"
      });
    }

    if (leaveType === "Annual" && noticeDays < 7) {
      return res.status(400).json({
        success: false,
        message: "Annual Leave requires at least 7 days advance notice"
      });
    }

    // ─── 7. Max consecutive days ──────────────────────────────
    if (leaveType === "Sick" && days > 3) {
      return res.status(400).json({
        success: false,
        message: "Sick Leave cannot exceed 3 consecutive days. For longer illness, contact HR."
      });
    }

    if (leaveType === "Casual" && days > 3) {
      return res.status(400).json({
        success: false,
        message: "Casual Leave cannot exceed 3 consecutive days"
      });
    }

    if (leaveType === "Annual" && days > 15) {
      return res.status(400).json({
        success: false,
        message: "Annual Leave cannot exceed 15 consecutive days"
      });
    }

    // ─── 8. Check annual leave balance ───────────────────────
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const usedLeaves = await Leave.find({
      employeeId,
      leaveType,
      status: { $in: ["Approved", "Pending"] },
      startDate: { $gte: startOfYear }
    });

    const usedDays = usedLeaves.reduce((sum, l) => sum + l.days, 0);

    const limits = { Sick: 10, Casual: 12, Annual: 15 };
    const remaining = limits[leaveType] - usedDays;

    if (days > remaining) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${leaveType} leave balance. You have ${remaining} days remaining out of ${limits[leaveType]} days.`
      });
    }

    // ─── 9. Check for overlapping leaves ─────────────────────
    const overlapping = await Leave.findOne({
      employeeId,
      status: { $ne: "Rejected" },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: "You already have a leave application for these dates"
      });
    }

    // ─── 10. Save leave ───────────────────────────────────────
    const leave = new Leave({
      employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      reason: reason.trim(),
      days,
      status: "Pending",
      appliedAt: new Date()
    });

    await leave.save();

    res.status(201).json({
      success: true,
      message: `${leaveType} Leave application submitted! ${remaining - days} ${leaveType} leave days remaining this year.`,
      leave,
      balance: {
        used: usedDays + days,
        remaining: remaining - days,
        total: limits[leaveType]
      }
    });

  } catch (error) {
    console.error("Leave apply error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employeeId",
        populate: {
          path: "userId department"
        }
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({ success: true, leaves });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate({
      path: "employeeId",
      populate: {
        path: "userId department"
      }
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found"
      });
    }

    res.status(200).json({ success: true, leave });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave updated successfully",
      leave
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

export default router;