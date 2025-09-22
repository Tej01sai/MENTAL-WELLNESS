import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const username = user?.username || 'User';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Profile</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Username:</span>
            <span>{username}</span>
          </div>
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
