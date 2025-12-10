import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, FileText } from 'lucide-react';
import clsx from 'clsx';

const AppLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const navItems = [
    { path: '/', label: 'Дашборд', icon: LayoutDashboard },
    { path: '/logs', label: 'Журнал событий', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">АСУ-Оповещение</h1>
          <p className="text-sm text-gray-500 mt-1">Оператор: {user.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-red-50 w-full rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
