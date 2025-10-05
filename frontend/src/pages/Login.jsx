import React, {useState} from 'react';
import api, { setAuthToken } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post('/login', { username, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);
      setAuthToken(token);
      navigate('/products');
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} className="w-full border p-2 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
