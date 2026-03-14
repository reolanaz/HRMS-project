import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: Date
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married"]
  },
  designation: {
    type: String,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  image: {
    type: String  // Will store image filename/path
  }
}, {
  timestamps: true
});

export default mongoose.model("Employee", employeeSchema);