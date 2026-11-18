import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, LogOut, User, Wallet, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role === 'USER') {
      api.get('/wallet/balance').then(res => setBalance(res.data.balance)).catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Bus className="w-8 h-8 mr-2 text-yellow-300" />
              <span className="font-extrabold text-2xl tracking-tight">BusTicket</span>
            </div>
            {user && (
              <div className="flex items-center space-x-6">
                {user.role === 'USER' && balance !== null && (
                  <div className="flex items-center bg-blue-800/50 px-3 py-1.5 rounded-full shadow-inner">
                    <Wallet className="w-5 h-5 mr-2 text-green-300" />
                    <span className="font-semibold tracking-wide">₹{balance.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-bold">{user.name}</span>
                    <span className="text-xs text-blue-200 capitalize">{user.role.toLowerCase()}</span>
                  </div>
                  {user.role === 'USER' ? (
                    <button onClick={() => navigate('/passenger/profile')} className="hover:text-yellow-300 transition-colors">
                      <UserCircle className="w-8 h-8" />
                    </button>
                  ) : (
                    <button onClick={() => navigate('/conductor/profile')} className="hover:text-yellow-300 transition-colors">
                      <UserCircle className="w-8 h-8" />
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-all shadow"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
};
