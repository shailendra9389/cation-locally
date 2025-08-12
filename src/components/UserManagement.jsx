import { useState } from 'react';
import { X, User, Lock, Eye, EyeOff, UserPlus, Shield, Wrench, Settings } from 'lucide-react';
import { userAPI } from '../services/api';

const UserManagement = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    userLevel: 'operator'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const userLevels = [
    { 
      value: 'engineer', 
      label: 'Engineer', 
      icon: Settings, 
      description: 'Access to temperature control and hopper' 
    },
    { 
      value: 'operator', 
      label: 'Operator', 
      icon: User, 
      description: 'Access to bottle rotation and door lock' 
    },
    { 
      value: 'maintenance', 
      label: 'Maintenance', 
      icon: Wrench, 
      description: 'Access to clamp control and alarms' 
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const userData = {
        name: formData.name,
        password: formData.password,
        userLevel: formData.userLevel
      };

      const response = await userAPI.createUser(userData);
      console.log('Create user response:', response);
      
      if (response.success) {
        setFormData({
          name: '',
          password: '',
          confirmPassword: '',
          userLevel: 'operator'
        });
        
        // Call the onUserCreated callback if provided
        if (typeof onUserCreated === 'function') {
          onUserCreated(response.data);
        }
        
        onClose();
        alert('User created successfully!');
      } else {
        setError(response.error || 'Failed to create user');
         console.warn('Create user failed:', response);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || 'An error occurred while creating the user');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New User</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-900 border border-red-600 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              User Level
            </label>
            <div className="space-y-2">
              {userLevels.map((level) => {
                const IconComponent = level.icon;
                return (
                  <label
                    key={level.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.userLevel === level.value
                        ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                        : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userLevel"
                      value={level.value}
                      checked={formData.userLevel === level.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-gray-300" />
                      <div>
                        <div className="text-sm font-medium text-white">{level.label}</div>
                        <div className="text-xs text-gray-400">{level.description}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating User...</span>
              </div>
            ) : (
              'Create User'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;