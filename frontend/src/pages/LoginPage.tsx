import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      toast.success('Успешный вход');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка входа');
    }
  };

  const handleRegister = async () => {
       try {
        const name = prompt("Введите имя оператора:");
        if(!name) return;
        const res = await api.post('/auth/register', { email, password, name });
        login(res.data.token, res.data.user);
        toast.success('Регистрация успешна');
        navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка регистрации');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Вход в АСУ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Пароль</label>
            <input
              type="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Войти
          </button>
        </form>
        <div className="mt-4 text-center">
            <button onClick={handleRegister} className="text-sm text-blue-500 hover:underline">
                Нет аккаунта? Зарегистрироваться
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
