import { useState, useEffect } from "react";
import axios from "axios";
import { MdPeople, MdApartment, MdAttachMoney, MdEventNote, MdCheckCircle, MdHourglassEmpty, MdCancel } from "react-icons/md";

const StatCard = ({ icon, label, value, gradient, iconBg }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
    <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-white/80 text-sm font-medium mb-2 tracking-wide uppercase">{label}</p>
        <p className="text-4xl font-bold text-white mb-1">{value}</p>
      </div>
      <div className={`${iconBg} p-4 rounded-xl shadow-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

const AdminSummary = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    avgSalary: 0,
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    rejectedLeaves: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const empRes = await axios.get("http://localhost:5000/api/employees", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const deptRes = await axios.get("http://localhost:5000/api/departments", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const leaveRes = await axios.get("http://localhost:5000/api/leaves", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const employees = empRes.data.employees || [];
        const departments = deptRes.data.departments || deptRes.data || [];
        const leaves = leaveRes.data.leaves || [];

        const totalSalary = employees.reduce(
          (sum, emp) => sum + (emp.salary || 0), 0
        );

        const avgSalary = employees.length > 0
          ? Math.round(totalSalary / employees.length)
          : 0;

        setStats({
          totalEmployees: employees.length,
          totalDepartments: departments.length,
          totalSalary,
          avgSalary,
          totalLeaves: leaves.length,
          approvedLeaves: leaves.filter(l => l.status === "Approved").length,
          pendingLeaves: leaves.filter(l => l.status === "Pending").length,
          rejectedLeaves: leaves.filter(l => l.status === "Rejected").length
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
          <p className="text-gray-500">Track your organization's key metrics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      {/* Top Stats - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<MdPeople size={32} className="text-white" />}
          label="Total Employees"
          value={stats.totalEmployees}
          gradient="from-blue-500 via-blue-600 to-blue-700"
          iconBg="bg-blue-400/30"
        />
        <StatCard
          icon={<MdApartment size={32} className="text-white" />}
          label="Total Departments"
          value={stats.totalDepartments}
          gradient="from-purple-500 via-purple-600 to-purple-700"
          iconBg="bg-purple-400/30"
        />
        <StatCard
          icon={<MdAttachMoney size={32} className="text-white" />}
          label="Monthly Payroll"
          value={`₹${stats.totalSalary.toLocaleString()}`}
          gradient="from-emerald-500 via-emerald-600 to-emerald-700"
          iconBg="bg-emerald-400/30"
        />
        <StatCard
          icon={<MdAttachMoney size={32} className="text-white" />}
          label="Average Salary"
          value={`₹${stats.avgSalary.toLocaleString()}`}
          gradient="from-orange-500 via-orange-600 to-orange-700"
          iconBg="bg-orange-400/30"
        />
      </div>

      {/* Leave Details Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-gray-900">Leave Management</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-5 border border-cyan-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-cyan-500 p-3 rounded-lg">
                <MdEventNote size={24} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-cyan-600 bg-cyan-200 px-2 py-1 rounded-full">ALL</span>
            </div>
            <p className="text-sm font-medium text-cyan-700 mb-1">Leave Applied</p>
            <p className="text-3xl font-bold text-cyan-900">{stats.totalLeaves}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-500 p-3 rounded-lg">
                <MdCheckCircle size={24} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-200 px-2 py-1 rounded-full">APPROVED</span>
            </div>
            <p className="text-sm font-medium text-green-700 mb-1">Leave Approved</p>
            <p className="text-3xl font-bold text-green-900">{stats.approvedLeaves}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-amber-500 p-3 rounded-lg">
                <MdHourglassEmpty size={24} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-200 px-2 py-1 rounded-full">PENDING</span>
            </div>
            <p className="text-sm font-medium text-amber-700 mb-1">Leave Pending</p>
            <p className="text-3xl font-bold text-amber-900">{stats.pendingLeaves}</p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-5 border border-rose-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-rose-500 p-3 rounded-lg">
                <MdCancel size={24} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-200 px-2 py-1 rounded-full">REJECTED</span>
            </div>
            <p className="text-sm font-medium text-rose-700 mb-1">Leave Rejected</p>
            <p className="text-3xl font-bold text-rose-900">{stats.rejectedLeaves}</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminSummary;