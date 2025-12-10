import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import StaffPage from './pages/Staff';
import MessagesPage from './pages/Messages';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StaffProvider } from './context/StaffContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // TODO: Uncomment when ready to enforce auth
  // const { user } = useAuth();
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <StaffProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
            <Route path="staff" element={<StaffPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="logs" element={<div>Журнал (в разработке)</div>} />
              <Route path="settings" element={<div>Настройки (в разработке)</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StaffProvider>
    </AuthProvider>
  );
}

export default App;
