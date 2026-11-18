import { useState, useEffect } from 'react';
import api from '../utils/api';
import { UserCircle } from 'lucide-react';

export const ConductorProfile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', mobile: '', gender: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/conductor/profile');
      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
        mobile: res.data.mobile || '',
        gender: res.data.gender || ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await api.put('/conductor/profile', { name: profile.name, mobile: profile.mobile, gender: profile.gender });
      alert('Profile updated');
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <UserCircle className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-extrabold text-gray-800">Conductor Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">Conductor ID (Email) - Cannot be changed</label>
            <input type="email" value={profile.email} disabled className="w-full border px-4 py-3 rounded-lg bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Name</label>
            <input 
              type="text" 
              value={profile.name} 
              disabled={!isEditing}
              onChange={(e) => setProfile({...profile, name: e.target.value})} 
              className={`w-full border px-4 py-3 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white' : 'bg-gray-50'}`} 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Mobile Number</label>
            <input 
              type="text" 
              value={profile.mobile} 
              disabled={!isEditing}
              onChange={(e) => setProfile({...profile, mobile: e.target.value})} 
              className={`w-full border px-4 py-3 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white' : 'bg-gray-50'}`} 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Gender</label>
            <select 
              value={profile.gender} 
              disabled={!isEditing}
              onChange={(e) => setProfile({...profile, gender: e.target.value})} 
              className={`w-full border px-4 py-3 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white' : 'bg-gray-50'}`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="pt-4">
            {isEditing ? (
              <div className="flex space-x-3">
                <button onClick={handleUpdateProfile} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
