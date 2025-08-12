import { useState, useEffect } from 'react';
import { User, Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { userAPI } from '../services/api';
import UserManagement from './UserManagement';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userAPI.getAllUsers();
      
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await userAPI.deleteUser(userId);
      
      if (response.success) {
        // Remove user from local state
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully!');
      } else {
        setError(response.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message || 'An error occurred while deleting user');
    }
  };

  // Handle user creation success
  const handleUserCreated = () => {
    setShowAddUser(false);
    fetchUsers(); // Refresh the list
  };

  // Get user level badge color
  const getUserLevelColor = (level) => {
    switch (level) {
      case 'engineer':
        return 'bg-purple-600 text-white';
      case 'maintenance':
        return 'bg-blue-600 text-white';
      case 'operator':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-300">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">User Management</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchUsers}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Refresh users"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">User Level</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                  No users found. Create your first user!
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserLevelColor(user.user_level)}`}>
                      {user.user_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(user.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-1 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
                        title="Edit user"
                      >
                        <Edit className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 rounded bg-red-600 hover:bg-red-700 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Count */}
      <div className="mt-4 text-sm text-gray-400">
        Total users: {users.length}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <UserManagement
          isOpen={showAddUser}
          onClose={() => setShowAddUser(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  );
};

export default UserList;