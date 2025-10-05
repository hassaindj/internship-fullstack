import React, {useState} from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      await api.post('/register', { username, password });
      setMsg('Registered! Redirecting to login...');
      setTimeout(()=>navigate('/login'), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Register failed');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Register</h2>
      {msg && <div className="mb-2">{msg}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} className="w-full border p-2 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" />
        <button className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
