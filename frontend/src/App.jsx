import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import Unauthorized from "./pages/unauthorized.jsx";
import PrivateRoutes from "./components/privateRoutes.jsx";
import AdminSummary from "./components/adminSummary.jsx";
import DepartmentList from "./components/departmentList.jsx";
import EmployeeList from "./components/employeeList.jsx";
import LeaveList from "./components/leaveList.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin only routes */}
        <Route element={<PrivateRoutes allowedRole="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminSummary />} />
            <Route path="employees" element={<EmployeeList />} /> {/* ✅ FIXED */}
            <Route path="departments" element={<DepartmentList />} />
            <Route path="leaves" element={<LeaveList />} />
            <Route path="salary" element={<div className="text-gray-500">Salary page coming soon</div>} />
            <Route path="settings" element={<div className="text-gray-500">Settings page coming soon</div>} />
          </Route>
        </Route>

        {/* Employee only routes */}
        <Route element={<PrivateRoutes allowedRole="employee" />}>
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;