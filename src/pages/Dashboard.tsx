import React from 'react';
import { Users, Send, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Всего участников', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { label: 'Отправлено сегодня', value: '856', icon: Send, color: 'bg-green-500' },
    { label: 'Ошибки доставки', value: '12', icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Успешно доставлено', value: '98.5%', icon: CheckCircle, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className={`${stat.color} p-4 rounded-full text-white mr-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Последние действия</h2>
          <div className="space-y-4">
             {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                 <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                 <div>
                   <p className="text-sm font-medium text-gray-900">Рассылка "Сбор 10:00" завершена</p>
                   <p className="text-xs text-gray-500">2 минуты назад • Оператор</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Статус системы</h2>
          <div className="space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-sm text-gray-600">SMS Шлюз</span>
               <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Активен</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-gray-600">База данных</span>
               <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Подключено</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-gray-600">Очередь сообщений</span>
               <span className="text-sm font-medium text-gray-900">0 ожидают</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
