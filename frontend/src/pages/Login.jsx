import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Login = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {

      alert("Login Successful");

      if (result.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }

    } else {
      alert(result.message || "Login failed");
    }
  };

  return (
    <div
      className="
        flex flex-col items-center justify-center h-screen
        bg-gradient-to-b from-[#50d5b7] to-[#067d68]
      "
    >

      <div className="border shadow p-8 w-[420px] bg-white rounded-lg">

        {/* Heading */}
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Human Resource Management System
        </h2>

        {/* Login Title */}
        <h3 className="text-xl font-semibold mb-4 text-center">
          Login
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Remember me</span>
            </div>

            <span className="text-sm text-[#0ccda3] hover:underline cursor-pointer">
              Forgot password?
            </span>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#0ccda3] text-white py-2 rounded-md hover:bg-[#0bb39a]"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;
