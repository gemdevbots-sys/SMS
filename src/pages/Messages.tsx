import React, { useState } from 'react';
import { useStaff } from '../context/StaffContext';
import { Send, Users, Clock, AlertCircle } from 'lucide-react';
import { sendSMS } from '../services/sms';

const MessagesPage: React.FC = () => {
  const { currentStaff } = useStaff();
  const [messageText, setMessageText] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [sending, setSending] = useState(false);
  const [lastStatus, setLastStatus] = useState<{success: boolean, text: string} | null>(null);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    
    setSending(true);
    setLastStatus(null);
    
    try {
      // In a real app, we would fetch participants and iterate, or send to a group API endpoint
      // Here we just simulate one call
      const response = await sendSMS({
        phone: '+70000000000', // Mock
        text: messageText,
        sender_name: 'ASU-Notify'
      });
      
      if (response.success) {
        setLastStatus({ success: true, text: `Успешно отправлено! ID: ${response.message_id}` });
        setMessageText('');
      } else {
        setLastStatus({ success: false, text: `Ошибка отправки: ${response.error}` });
      }
    } catch (e) {
      setLastStatus({ success: false, text: 'Произошла непредвиденная ошибка' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div>
         <h1 className="text-2xl font-bold text-gray-900">Рассылка сообщений</h1>
         <p className="text-sm text-gray-500">Отправка SMS уведомлений участникам штаба "{currentStaff?.name}"</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-2">Получатели</label>
               <div className="flex gap-4">
                 <label className="flex items-center">
                   <input 
                     type="radio" 
                     name="target" 
                     value="all" 
                     checked={targetGroup === 'all'} 
                     onChange={(e) => setTargetGroup(e.target.value)}
                     className="text-blue-600 focus:ring-blue-500" 
                   />
                   <span className="ml-2 text-sm text-gray-700">Все участники</span>
                 </label>
                 <label className="flex items-center">
                   <input 
                     type="radio" 
                     name="target" 
                     value="selected"
                     checked={targetGroup === 'selected'} 
                     onChange={(e) => setTargetGroup(e.target.value)}
                     className="text-blue-600 focus:ring-blue-500" 
                   />
                   <span className="ml-2 text-sm text-gray-700">Выбранные</span>
                 </label>
               </div>
             </div>

             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-2">Текст сообщения</label>
               <div className="relative">
                 <textarea
                   rows={6}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                   placeholder="Введите текст уведомления..."
                   value={messageText}
                   onChange={(e) => setMessageText(e.target.value)}
                 />
                 <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                   {messageText.length} символов
                 </div>
               </div>
               <p className="mt-1 text-xs text-gray-500">
                 Внимание: 1 SMS = 70 кириллических символов.
               </p>
             </div>

             <div className="flex justify-between items-center pt-4 border-t border-gray-100">
               <button className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center">
                 <Clock className="w-4 h-4 mr-2" />
                 Запланировать отправку
               </button>
               
               <button 
                 onClick={handleSend}
                 disabled={sending || !messageText}
                 className={`flex items-center px-6 py-2 rounded-md text-white font-medium transition-colors ${
                   sending || !messageText 
                     ? 'bg-gray-400 cursor-not-allowed' 
                     : 'bg-green-600 hover:bg-green-700'
                 }`}
               >
                 {sending ? 'Отправка...' : 'Отправить SMS'}
                 <Send className="w-4 h-4 ml-2" />
               </button>
             </div>
           </div>
           
           {lastStatus && (
             <div className={`p-4 rounded-md flex items-center ${lastStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
               {lastStatus.success ? <Users className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
               {lastStatus.text}
             </div>
           )}
         </div>

         <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Информация</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Баланс:</span>
                  <span className="font-semibold text-green-600">500.00 ₽</span>
                </li>
                <li className="flex justify-between">
                  <span>Стоимость SMS:</span>
                  <span>2.50 ₽</span>
                </li>
                <li className="flex justify-between">
                  <span>Лимит на сегодня:</span>
                  <span>1000 шт.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-blue-800 font-medium mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Совет
              </h4>
              <p className="text-xs text-blue-600">
                Используйте шаблоны для быстрой отправки типовых уведомлений.
              </p>
            </div>
         </div>
       </div>
    </div>
  );
};

export default MessagesPage;
