import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  leaveType: {
    type: String,
    enum: ["Sick", "Casual", "Annual"],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true,
    minlength: [10, "Reason must be at least 10 characters"]
  },
  days: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Leave", leaveSchema);