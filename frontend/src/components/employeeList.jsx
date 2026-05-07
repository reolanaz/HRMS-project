import { useState, useEffect } from "react";
import axios from "axios";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    salary: "",
    password: "",
    role: "employee"
  });

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/departments", {
        headers: { Authorization: `Bearer ${token}` }
      });
     setDepartments(res.data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editingEmp) {
        // Update
        await axios.put(
          `http://localhost:5000/api/employees/${editingEmp._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add new
        await axios.post(
          "http://localhost:5000/api/employees",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchEmployees();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving employee");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee? This will also delete their login account.")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (error) {
      alert("Error deleting employee");
    }
  };

  // Handle Edit
  const handleEdit = (emp) => {
    setEditingEmp(emp);
    setFormData({
      name: emp.userId?.name || "",
      email: emp.userId?.email || "",
      employeeId: emp.employeeId,
      dob: emp.dob ? emp.dob.split("T")[0] : "",
      gender: emp.gender || "",
      maritalStatus: emp.maritalStatus || "",
      designation: emp.designation,
      department: emp.department?._id || "",
      salary: emp.salary,
      password: "",
      role: "employee"
    });
    setShowModal(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      employeeId: "",
      dob: "",
      gender: "",
      maritalStatus: "",
      designation: "",
      department: "",
      salary: "",
      password: "",
      role: "employee"
    });
    setEditingEmp(null);
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp =>
    emp.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Employees</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-all font-semibold"
        >
          <MdAdd size={20} />
          Add New Employee
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Name or Employee ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">S No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Designation</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp, index) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-700">{emp.userId?.name}</td>
                  <td className="px-6 py-4 text-gray-700">{emp.employeeId}</td>
                  <td className="px-6 py-4 text-gray-700">{emp.department?.name}</td>
                  <td className="px-6 py-4 text-gray-700">{emp.designation}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="flex items-center gap-1 bg-green-500 text-white px-4 py-1.5 rounded hover:bg-green-600 text-sm"
                    >
                      <MdEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm"
                    >
                      <MdDelete />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-8 w-[800px] max-h-[90vh] overflow-y-auto my-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingEmp ? "Edit Employee" : "Add New Employee"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">

                {/* Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Insert Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Insert Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Employee ID</label>
                  <input
                    type="text"
                    placeholder="Employee ID"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Marital Status</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Designation</label>
                  <input
                    type="text"
                    placeholder="Designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Salary</label>
                  <input
                    type="number"
                    placeholder="Salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password {editingEmp && <span className="text-sm text-gray-500">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    placeholder="******"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required={!editingEmp}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 font-semibold"
                >
                  {editingEmp ? "Update Employee" : "Add Employee"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeList;