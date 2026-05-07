import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("MongoDB Connected");

    // 🔥 DELETE old users (important)
    await User.deleteMany({});
    console.log("Old users deleted");

    // Create hashed password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
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

seedUser();