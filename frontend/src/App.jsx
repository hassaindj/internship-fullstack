import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import { setAuthToken } from './api';
import './index.css';

function App(){
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []);

  return (
    <div>
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
