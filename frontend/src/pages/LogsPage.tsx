import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Notification {
  id: number;
  messageText: string;
  status: string;
  sentAt: string | null;
  errorMessage: string | null;
  participant: {
    fio: string;
    phone: string;
  };
}

const LogsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error('Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'error':
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <Clock size={18} className="text-gray-400" />;
    }
  };

  if (loading) return <div className="p-4">Загрузка журнала...</div>;

  return (
    <div>
       <h2 className="text-2xl font-bold text-gray-800 mb-6">Журнал уведомлений</h2>

       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <table className="w-full text-left">
           <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
             <tr>
               <th className="p-4">Время</th>
               <th className="p-4">Участник</th>
               <th className="p-4">Сообщение</th>
               <th className="p-4">Статус</th>
               <th className="p-4">Ошибка</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {notifications.map((n) => (
               <tr key={n.id} className="hover:bg-gray-50">
                 <td className="p-4 text-sm text-gray-500">
                   {n.sentAt ? format(new Date(n.sentAt), 'dd.MM.yyyy HH:mm:ss') : '-'}
                 </td>
                 <td className="p-4">
                   <div className="font-medium text-gray-800">{n.participant.fio}</div>
                   <div className="text-xs text-gray-500">{n.participant.phone}</div>
                 </td>
                 <td className="p-4 text-sm text-gray-600 truncate max-w-xs" title={n.messageText}>
                   {n.messageText}
                 </td>
                 <td className="p-4">
                   <div className="flex items-center space-x-2">
                     {getStatusIcon(n.status)}
                     <span className="capitalize text-sm">{n.status}</span>
                   </div>
                 </td>
                 <td className="p-4 text-sm text-red-500">
                   {n.errorMessage || '-'}
                 </td>
               </tr>
             ))}
             {notifications.length === 0 && (
               <tr>
                 <td colSpan={5} className="p-8 text-center text-gray-500">
                   История пуста
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>
    </div>
  );
};

export default LogsPage;
