import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Products(){
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  async function load(){
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  }

  useEffect(()=>{ load(); }, []);

  async function handleCreate(e){
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      price: parseFloat(form.price.value),
      category: form.category.value,
      description: form.description.value
    };
    try {
      const res = await api.post('/products', data);
      setProducts(prev=>[res.data, ...prev]);
      setShowForm(false);
      setMsg('Product added');
      setTimeout(()=>setMsg(''), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  }

  async function handleUpdate(e){
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      price: parseFloat(form.price.value),
      category: form.category.value,
      description: form.description.value
    };
    try {
      const res = await api.put(`/products/${editing.id}`, data);
      setProducts(prev=>prev.map(p => p.id === res.data.id ? res.data : p));
      setEditing(null);
      setShowForm(false);
      setMsg('Product updated');
      setTimeout(()=>setMsg(''), 2000);
    } catch (err) { setMsg('Update failed'); }
  }

  async function handleDelete(p){
    if (!confirm(`Delete ${p.name}?`)) return;
    try {
      await api.delete(`/products/${p.id}`);
      setProducts(prev=>prev.filter(x=>x.id!==p.id));
      setMsg('Deleted');
      setTimeout(()=>setMsg(''), 1500);
    } catch (err) { setMsg('Delete failed'); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Products</h1>
        <div>
          <button onClick={()=>{ setEditing(null); setShowForm(true); }} className="px-3 py-1 bg-green-600 text-white rounded">Add Product</button>
        </div>
      </div>
      {msg && <div className="mb-3 text-sm text-green-700">{msg}</div>}
      {showForm && !editing && (
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow space-y-2 mb-4">
          <input name="name" required placeholder="Name" className="w-full border p-2 rounded" />
          <input name="price" required placeholder="Price" className="w-full border p-2 rounded" />
          <input name="category" required placeholder="Category" className="w-full border p-2 rounded" />
          <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" />
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            <button type="button" onClick={()=>setShowForm(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
          </div>
        </form>
      )}
      {showForm && editing && (
        <form onSubmit={handleUpdate} className="bg-white p-4 rounded shadow space-y-2 mb-4">
          <input name="name" defaultValue={editing.name} required placeholder="Name" className="w-full border p-2 rounded" />
          <input name="price" defaultValue={editing.price} required placeholder="Price" className="w-full border p-2 rounded" />
          <input name="category" defaultValue={editing.category} required placeholder="Category" className="w-full border p-2 rounded" />
          <textarea name="description" defaultValue={editing.description} placeholder="Description" className="w-full border p-2 rounded" />
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            <button type="button" onClick={()=>{ setShowForm(false); setEditing(null); }} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded shadow p-4 flex flex-col">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500">{p.category}</div>
            <div className="mt-2 text-lg font-bold">${p.price}</div>
            <p className="mt-2 text-sm flex-1">{p.description}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>{ setEditing(p); setShowForm(true); }} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
              <button onClick={()=>handleDelete(p)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
