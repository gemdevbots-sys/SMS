import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Plus, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

interface Participant {
  id: number;
  fio: string;
  phone: string;
  position: string;
  lastNotificationStatus?: string;
}

interface Staff {
  id: number;
  name: string;
  participants: Participant[];
}

const StaffDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [participantForm, setParticipantForm] = useState({ fio: '', phone: '', position: '' });

  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [smsText, setSmsText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await api.get(`/staffs/${id}`);
      setStaff(res.data);
    } catch (error) {
      toast.error('Не удалось загрузить данные штаба');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/participants', { ...participantForm, staffId: id });
      toast.success('Участник добавлен');
      setIsParticipantModalOpen(false);
      setParticipantForm({ fio: '', phone: '', position: '' });
      fetchStaff();
    } catch (error) {
      toast.error('Ошибка добавления участника');
    }
  };

  const handleDeleteParticipant = async (pId: number) => {
    if (!confirm('Удалить участника?')) return;
    try {
      await api.delete(`/participants/${pId}`);
      toast.success('Участник удален');
      setStaff(prev => prev ? ({...prev, participants: prev.participants.filter(p => p.id !== pId)}) : null);
    } catch (error) {
       toast.error('Ошибка удаления');
    }
  };

  const handleToggleSelect = (pId: number) => {
    if (selectedParticipants.includes(pId)) {
      setSelectedParticipants(selectedParticipants.filter(id => id !== pId));
    } else {
      setSelectedParticipants([...selectedParticipants, pId]);
    }
  };

  const handleSelectAll = () => {
    if (staff && selectedParticipants.length === staff.participants.length) {
      setSelectedParticipants([]);
    } else if (staff) {
      setSelectedParticipants(staff.participants.map(p => p.id));
    }
  };

  const handleSendSms = async () => {
    if (selectedParticipants.length === 0) return toast.error('Выберите участников');
    if (!smsText.trim()) return toast.error('Введите текст сообщения');

    setIsSending(true);
    try {
      await api.post('/send-sms', {
        staffId: id,
        participantIds: selectedParticipants,
        messageText: smsText
      });
      toast.success('Сообщения отправлены в очередь');
      setIsSmsModalOpen(false);
      setSmsText('');
      setSelectedParticipants([]);
    } catch (error) {
      toast.error('Ошибка отправки');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (!staff) return <div className="p-4">Штаб не найден</div>;

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={24} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">{staff.name}</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setIsParticipantModalOpen(true)}
              className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition text-sm"
            >
              <Plus size={16} />
              <span>Добавить участника</span>
            </button>
            <button
              onClick={() => setIsSmsModalOpen(true)}
              disabled={selectedParticipants.length === 0}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              <span>Отправить SMS ({selectedParticipants.length})</span>
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Всего участников: {staff.participants.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.length === staff.participants.length && staff.participants.length > 0}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600"
                  />
                </th>
                <th className="p-4">ФИО</th>
                <th className="p-4">Телефон</th>
                <th className="p-4">Должность</th>
                <th className="p-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.participants.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(p.id)}
                      onChange={() => handleToggleSelect(p.id)}
                      className="rounded text-blue-600"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{p.fio}</td>
                  <td className="p-4 text-gray-600">{p.phone}</td>
                  <td className="p-4 text-gray-500">{p.position || '-'}</td>
                  <td className="p-4 text-right">
                    <button
                       onClick={() => handleDeleteParticipant(p.id)}
                       className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {staff.participants.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    В штабе пока нет участников.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        title="Новый участник"
      >
        <form onSubmit={handleAddParticipant} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
            <input
              type="text"
              value={participantForm.fio}
              onChange={e => setParticipantForm({...participantForm, fio: e.target.value})}
              required
              className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input
              type="text"
              value={participantForm.phone}
              onChange={e => setParticipantForm({...participantForm, phone: e.target.value})}
              required
              placeholder="79001234567"
              className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
            <input
              type="text"
              value={participantForm.position}
              onChange={e => setParticipantForm({...participantForm, position: e.target.value})}
              className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end pt-4">
             <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Сохранить</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        title={`Отправка SMS (${selectedParticipants.length})`}
      >
         <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Текст сообщения</label>
                <textarea
                    rows={4}
                    value={smsText}
                    onChange={e => setSmsText(e.target.value)}
                    className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Введите текст уведомления..."
                />
                <p className="text-xs text-gray-500 mt-1">Символов: {smsText.length}</p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setIsSmsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Отмена</button>
                <button
                    onClick={handleSendSms}
                    disabled={isSending}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSending ? 'Отправка...' : 'Отправить'}
                </button>
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default StaffDetails;
