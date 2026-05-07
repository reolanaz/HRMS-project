import Leave from "../models/leave.js";
import Employee from "../models/employee.js";

// Get all leaves (Admin)
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employeeId",
        populate: { path: "userId", select: "name" }
      })
      .sort({ appliedAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Apply for leave (Employee)
export const applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      days,
      status: "Pending"
    });

    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single leave
export const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id)
      .populate({
        path: "employeeId",
        populate: { path: "userId", select: "name email" }
      });

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update leave status (Admin - Approve/Reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get employee's own leaves
export const getEmployeeLeaves = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const leaves = await Leave.find({ employeeId })
      .sort({ appliedAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};