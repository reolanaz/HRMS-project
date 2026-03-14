import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const userRegister = async () => {
  try {

    await mongoose.connect(process.env.DATABASE_URL);

    console.log("MongoDB Connected");

    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashPassword = await bcrypt.hash("admin123", 10);

    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPassword,
      role: "admin",
    });

    await newUser.save();

    console.log("✅ Admin user created successfully");
    process.exit();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
userRegister(); // 

