import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, FileText, Settings, LogOut, Building } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { useStaff } from '../context/StaffContext';

export const Layout: React.FC = () => {
  const { signOut, user } = useAuth();
  const { currentStaff, staffs, setCurrentStaff } = useStaff();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Дашборд' },
    { to: '/staff', icon: Users, label: 'Участники' },
    { to: '/messages', icon: MessageSquare, label: 'Рассылки' },
    { to: '/logs', icon: FileText, label: 'Журнал' },
    { to: '/settings', icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
             <MessageSquare className="w-8 h-8" />
             <span>АСУ-Оповещение</span>
          </div>
        </div>

        <div className="p-4">
           <div className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Текущий штаб</div>
           <div className="relative">
             <select 
               className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
               value={currentStaff?.id || ''}
               onChange={(e) => {
                 const staff = staffs.find(s => s.id === e.target.value);
                 setCurrentStaff(staff || null);
               }}
             >
               {staffs.map(s => (
                 <option key={s.id} value={s.id}>{s.name}</option>
               ))}
             </select>
             <Building className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              OP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email || 'Оператор'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">
             {/* Dynamic Title could go here */}
             Панель управления
          </h1>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
