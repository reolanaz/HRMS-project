import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Note: You'll need to create this backend route
      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Settings Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Settings Menu</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-teal-50 text-teal-700 rounded-lg font-medium">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                Notifications
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                Privacy
              </button>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h4 className="font-semibold text-gray-800">{user?.name}</h4>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Right Content - Change Password Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Change Password</h3>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* New Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              {/* Confirm New Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-all duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  })}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Security Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🔒 Password Security Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use a combination of letters, numbers, and special characters</li>
                <li>• Avoid using personal information in your password</li>
                <li>• Don't reuse passwords across different accounts</li>
                <li>• Change your password regularly for better security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;