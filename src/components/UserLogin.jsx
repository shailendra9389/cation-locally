import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { userAPI } from '../services/api';

const UserLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await userAPI.login(formData);
      console.log("🔍 Full login API response:", response);

      if (response.success) {
        // The API response structure is response.data.data, not just response.data
        const { token, user } = response.data.data;
        console.log("💾 Saving user:", user);
        // Store both token and user in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Notify parent
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }

        alert('Login successful!');
      } else {
        setError(response.error || 'Invalid credentials');
      }
    } catch (error) {
      console.warn("⚠️ Login API returned no user");
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-600">
        <h2 className="text-xl font-bold text-white">User Authentication Intellimeta</h2>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-900 border border-red-600 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Username */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600"
              placeholder="Enter username"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-12 py-3 bg-gray-700 text-white rounded-lg border border-gray-600"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
