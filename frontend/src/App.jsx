import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import LandingPage from './pages/LandingPage';
import Unauthorized from './pages/Unauthorized';

// Auth
import PrivateRoutes from './components/PrivateRoutes';

// Admin Components
import AdminSummary from './components/AdminSummary';
import DepartmentList from './components/DepartmentList';
import EmployeeList from './components/EmployeeList';
import LeaveList from './components/LeaveList';
import SalaryManagement from './components/SalaryManagement';
import Settings from './components/Settings';
import PaySlip from './components/PaySlip';

// Employee Components
import EmployeeSummary from './components/EmployeeSummary';
import ApplyLeave from './components/ApplyLeave';
import EmployeeLeaveHistory from './components/EmployeeLeaveHistory';
import EmployeeProfile from './components/EmployeeProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="leaves" element={<LeaveList />} />
          <Route path="salary" element={<SalaryManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Employee Routes */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes allowedRoles={['employee']}>
              <EmployeeDashboard />
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="leaves" element={<EmployeeLeaveHistory />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="payslip" element={<PaySlip />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;