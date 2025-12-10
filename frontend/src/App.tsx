import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import StaffDetails from './pages/StaffDetails';
import LogsPage from './pages/LogsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="staffs/:id" element={<StaffDetails />} />
            <Route path="logs" element={<LogsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
