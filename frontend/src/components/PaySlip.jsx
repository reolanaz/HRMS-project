import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const PaySlip = () => {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const employees = response.data.employees || [];
      const employee = employees.find(
        emp => emp.userId._id.toString() === user._id.toString()
      );
      setEmployeeData(employee);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg">
          Employee data not found.
        </div>
      </div>
    );
  }

  // Salary Calculations
  const basicSalary = employeeData.salary;
  const hra = Math.round(basicSalary * 0.40);           // 40% HRA
  const transportAllowance = 1600;                       // Fixed
  const medicalAllowance = 1250;                         // Fixed
  const specialAllowance = Math.round(basicSalary * 0.10); // 10% special
  const grossSalary = basicSalary + hra + transportAllowance + medicalAllowance + specialAllowance;

  // Deductions
  const providentFund = Math.round(basicSalary * 0.12); // 12% PF
  const professionalTax = 200;                           // Fixed
  const incomeTax = Math.round(grossSalary * 0.10);     // 10% TDS
  const totalDeductions = providentFund + professionalTax + incomeTax;

  const netSalary = grossSalary - totalDeductions;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pay Slip</h2>
          <p className="text-gray-600 mt-1">View and download your salary slip</p>
        </div>

        {/* Month/Year Selector */}
        <div className="flex gap-3 items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={handlePrint}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2"
          >
            🖨️ Print / Download
          </button>
        </div>
      </div>

      {/* Pay Slip Document */}
      <div id="payslip" className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="border-b-2 border-teal-600 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-teal-600">StaffSync</h1>
              <p className="text-gray-600">Employee Management System</p>
              <p className="text-gray-500 text-sm">Udupi, Karnataka, India</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800">SALARY SLIP</h2>
              <p className="text-gray-600">
                {months[selectedMonth]} {selectedYear}
              </p>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-gray-500 w-32">Employee Name:</span>
              <span className="font-semibold">{employeeData.userId.name}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-32">Employee ID:</span>
              <span className="font-semibold">{employeeData.employeeId}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-32">Designation:</span>
              <span className="font-semibold">{employeeData.designation}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-gray-500 w-32">Department:</span>
              <span className="font-semibold">{employeeData.department?.name}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-32">Email:</span>
              <span className="font-semibold">{employeeData.userId.email}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-32">Pay Period:</span>
              <span className="font-semibold">{months[selectedMonth]} {selectedYear}</span>
            </div>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* Earnings */}
          <div>
            <h3 className="font-bold text-gray-800 bg-teal-50 border border-teal-200 px-4 py-2 rounded-t-lg">
              💰 Earnings
            </h3>
            <table className="w-full border border-t-0 border-gray-200 rounded-b-lg overflow-hidden">
              <tbody>
                {[
                  ["Basic Salary", basicSalary],
                  ["House Rent Allowance (40%)", hra],
                  ["Transport Allowance", transportAllowance],
                  ["Medical Allowance", medicalAllowance],
                  ["Special Allowance (10%)", specialAllowance],
                ].map(([label, amount], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 text-sm text-gray-700">{label}</td>
                    <td className="px-4 py-2 text-sm font-medium text-right">
                      ₹{amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-teal-50 border-t-2 border-teal-300">
                  <td className="px-4 py-2 font-bold text-teal-800">Gross Salary</td>
                  <td className="px-4 py-2 font-bold text-teal-800 text-right">
                    ₹{grossSalary.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="font-bold text-gray-800 bg-red-50 border border-red-200 px-4 py-2 rounded-t-lg">
              📉 Deductions
            </h3>
            <table className="w-full border border-t-0 border-gray-200 rounded-b-lg overflow-hidden">
              <tbody>
                {[
                  ["Provident Fund (12%)", providentFund],
                  ["Professional Tax", professionalTax],
                  ["Income Tax (TDS 10%)", incomeTax],
                ].map(([label, amount], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 text-sm text-gray-700">{label}</td>
                    <td className="px-4 py-2 text-sm font-medium text-right text-red-600">
                      -₹{amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-red-50 border-t-2 border-red-300">
                  <td className="px-4 py-2 font-bold text-red-800">Total Deductions</td>
                  <td className="px-4 py-2 font-bold text-red-800 text-right">
                    -₹{totalDeductions.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Salary */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white text-center">
          <p className="text-teal-100 mb-1">Net Take-Home Salary</p>
          <p className="text-5xl font-bold">₹{netSalary.toLocaleString()}</p>
          <p className="text-teal-100 text-sm mt-2">
            For the month of {months[selectedMonth]} {selectedYear}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>This is a computer-generated payslip and does not require a signature.</p>
          <p>For any queries, please contact the HR department.</p>
        </div>
      </div>
    </div>
  );
};

export default PaySlip;