import Employee from "../models/employee.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", "name email")
      .populate("department", "name")
      .sort({ createdAt: -1 });
    
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add new employee
export const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      role = "employee"
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user first
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Create employee
    const newEmployee = await Employee.create({
      userId: newUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary
    });

    res.status(201).json({ message: "Employee created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single employee
export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findById(id)
      .populate("userId", "name email")
      .populate("department", "name");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary
    } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update user info
    await User.findByIdAndUpdate(employee.userId, { name, email });

    // Update employee info
    await Employee.findByIdAndUpdate(id, {
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary
    });

    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete user
    await User.findByIdAndDelete(employee.userId);
    
    // Delete employee
    await Employee.findByIdAndDelete(id);

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};