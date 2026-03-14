import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <p className="text-xl text-gray-700 mb-2">Access Denied</p>
        <p className="text-gray-500 mb-6">You don't have permission to view this page.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;