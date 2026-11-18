import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PassengerDashboard } from './pages/PassengerDashboard';
import { ConductorDashboard } from './pages/ConductorDashboard';
import { Profile } from './pages/Profile';
import { AddMoney } from './pages/AddMoney';
import { ConductorProfile } from './pages/ConductorProfile';

import { ForgotPassword } from './pages/ForgotPassword';

const ProtectedRoute = ({ children, allowedRole }: { children: JSX.Element, allowedRole: string }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to={user.role === 'USER' ? '/passenger' : '/conductor'} replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={user ? <Navigate to={user.role === 'USER' ? '/passenger' : '/conductor'} replace /> : <Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        
        <Route path="passenger" element={
          <ProtectedRoute allowedRole="USER">
            <PassengerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="passenger/profile" element={
          <ProtectedRoute allowedRole="USER">
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="passenger/add-money" element={
          <ProtectedRoute allowedRole="USER">
            <AddMoney />
          </ProtectedRoute>
        } />
        
        <Route path="conductor" element={
          <ProtectedRoute allowedRole="CONDUCTOR">
            <ConductorDashboard />
          </ProtectedRoute>
        } />

        <Route path="conductor/profile" element={
          <ProtectedRoute allowedRole="CONDUCTOR">
            <ConductorProfile />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
