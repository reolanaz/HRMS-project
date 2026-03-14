import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/adminSidebar";
import AdminNavbar from "../components/adminNavbar";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;