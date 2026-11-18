import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { UserCircle, Wallet, CreditCard } from 'lucide-react';

export const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', mobile: '', gender: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  const fetchProfileAndBalance = async () => {
    try {
      const [profRes, balRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/wallet/balance')
      ]);
      setProfile({
        name: profRes.data.name || '',
        email: profRes.data.email || '',
        mobile: profRes.data.mobile || '',
        gender: profRes.data.gender || ''
      });
      setBalance(balRes.data.balance);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfileAndBalance();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await api.put('/user/profile', { name: profile.name, mobile: profile.mobile, gender: profile.gender });
      alert('Profile updated');
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Profile Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <UserCircle className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-extrabold text-gray-800">My Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">Email (cannot be changed)</label>
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

      {/* Wallet Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Wallet className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-extrabold text-gray-800">Wallet</h2>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 font-semibold">Current Balance</div>
            <div className="text-4xl font-extrabold text-blue-600">₹{balance.toFixed(2)}</div>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/passenger/add-money')}
          className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-4 rounded-xl mt-auto transition-colors flex items-center justify-center"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Add Money to Wallet
        </button>
      </div>
    </div>
  );
};
