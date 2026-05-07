import { useState, useEffect } from "react";
import axios from "axios";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

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
    fetchDepartments();
  }, []);

  // Handle Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      if (editingDept) {
        // Update
        await axios.put(
          `http://localhost:5000/api/departments/${editingDept._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add new
        await axios.post(
          "http://localhost:5000/api/departments",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      fetchDepartments();
      setShowModal(false);
      setFormData({ name: "", description: "" });
      setEditingDept(null);
    } catch (error) {
      alert(error.response?.data?.message || "Error saving department");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDepartments();
    } catch (error) {
      alert("Error deleting department");
    }
  };

  // Open Edit Modal
  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description || "" });
    setShowModal(true);
  };

  // Open Add Modal
  const handleAdd = () => {
    setEditingDept(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  // Filter departments
  const filteredDepts = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Departments</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-all font-semibold"
        >
          <MdAdd size={20} />
          Add New Department
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search By Department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">S No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepts.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                  No departments found
                </td>
              </tr>
            ) : (
              filteredDepts.map((dept, index) => (
                <tr key={dept._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-700">{dept.name}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="flex items-center gap-1 bg-green-500 text-white px-4 py-1.5 rounded hover:bg-green-600 text-sm"
                    >
                      <MdEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[500px] shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingDept ? "Edit Department" : "Add New Department"}
            </h3>
            
            <form onSubmit={handleSubmit}>
              {/* Department Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  placeholder="Department Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-24"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 font-semibold"
                >
                  {editingDept ? "Update Department" : "Add Department"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDept(null);
                    setFormData({ name: "", description: "" });
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

export default DepartmentList;