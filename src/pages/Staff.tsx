import React, { useState } from 'react';
import { useStaff } from '../context/StaffContext';
import { Plus, Search, Upload, User, Trash2, Edit } from 'lucide-react';
import type { Participant } from '../types';

const StaffPage: React.FC = () => {
  const { currentStaff, staffs } = useStaff();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock participants for demonstration since we don't have a real DB connected in sandbox
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', staff_id: '1', fio: 'Иванов Иван Иванович', phone: '+79991234567', position: 'Координатор', created_at: new Date().toISOString() },
    { id: '2', staff_id: '1', fio: 'Петров Петр Петрович', phone: '+79997654321', position: 'Волонтер', created_at: new Date().toISOString() },
    { id: '3', staff_id: '2', fio: 'Сидоров Сидор Сидорович', phone: '+79991112233', position: 'Водитель', created_at: new Date().toISOString() },
  ]);

  if (!currentStaff) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">Выберите штаб для работы</h2>
      </div>
    );
  }

  const filteredParticipants = participants.filter(
    p => p.staff_id === currentStaff.id && 
    (p.fio.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone.includes(searchTerm))
  );

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить участника?')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">{currentStaff.name}</h1>
           <p className="text-sm text-gray-500">Управление участниками штаба</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
            <Upload className="w-4 h-4 mr-2" />
            Импорт Excel
          </button>
          <button 
             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
             onClick={() => alert('Функция добавления будет реализована в модальном окне')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить участника
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Поиск по ФИО или телефону..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ФИО
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Телефон
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Должность
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{person.fio}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {person.position || 'Участник'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(person.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  Участники не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
           {/* Pagination stub */}
           <div className="text-sm text-gray-500">
             Показано {filteredParticipants.length} участников
           </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
