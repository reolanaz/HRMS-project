import { useState, useEffect } from "react";
import axios from "axios";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/leaves", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handle Approve/Reject
  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/leaves/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLeaves(); // Refresh the list
      alert(`Leave ${status.toLowerCase()} successfully!`);
    } catch (error) {
      alert("Error updating leave status");
    }
  };

  // Filter leaves
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employeeId?.userId?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="p-6">

      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Leave Requests</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Employee Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">S No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Leave Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">End Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Days</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                  No leave requests found
                </td>
              </tr>
            ) : (
              filteredLeaves.map((leave, index) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-700">{leave.employeeId?.userId?.name}</td>
                  <td className="px-6 py-4 text-gray-700">{leave.leaveType}</td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(leave.startDate)}</td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(leave.endDate)}</td>
                  <td className="px-6 py-4 text-gray-700">{leave.days}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className="max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      leave.status === "Approved" ? "bg-green-100 text-green-700" :
                      leave.status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {leave.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(leave._id, "Approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(leave._id, "Rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No action</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default LeaveList;