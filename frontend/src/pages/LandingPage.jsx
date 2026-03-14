import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col items-center justify-center p-6">
      
      {/* Illustration */}
      <div className="mb-8">
        <img 
          src="/coworking-illustration.jpg" 
          alt="Employee Management" 
          className="w-96 h-auto object-contain rounded-lg"
        />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black-500 mb-2 flex items-center justify-center gap-2">
          <span className="text-5xl"></span>
          Human Resource Management System
        </h1>
        <p className="text-gray-600 text-sm">Developed using React and Node.js</p>
      </div>

      {/* Buttons - both go to same login */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-teal-700 transition-all text-lg shadow-md"
        >
          Employee
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-green-700 transition-all text-lg shadow-md"
        >
          Admin
        </button>
      </div>

    </div>
  );
};

export default LandingPage;