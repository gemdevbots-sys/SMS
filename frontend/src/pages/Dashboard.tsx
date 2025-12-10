import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Plus, Users, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

interface Staff {
  id: number;
  name: string;
  _count: {
    participants: number;
  };
}

const Dashboard: React.FC = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');

  const fetchStaffs = async () => {
    try {
      const res = await api.get('/staffs');
      setStaffs(res.data);
    } catch (error) {
      toast.error('Не удалось загрузить список штабов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/staffs', { name: newStaffName });
      toast.success('Штаб создан');
      setNewStaffName('');
      setIsModalOpen(false);
      fetchStaffs();
    } catch (error) {
      toast.error('Ошибка при создании штаба');
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!confirm('Вы уверены? Все участники и история будут удалены.')) return;
    try {
      await api.delete(`/staffs/${id}`);
      toast.success('Штаб удален');
      setStaffs(staffs.filter(s => s.id !== id));
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Список штабов</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Добавить штаб</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffs.map((staff) => (
          <div key={staff.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{staff.name}</h3>
              <button
                onClick={() => handleDeleteStaff(staff.id)}
                className="text-gray-400 hover:text-red-500"
                title="Удалить штаб"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex items-center text-gray-500 mb-6">
              <Users size={18} className="mr-2" />
              <span>Участников: {staff._count.participants}</span>
            </div>

            <Link
              to={`/staffs/${staff.id}`}
              className="block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Управление
            </Link>
          </div>
        ))}

        {staffs.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
                Нет созданных штабов. Создайте первый!
            </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Новый штаб"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название штаба</label>
            <input
              type="text"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Например: Центральный штаб"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Создать
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
