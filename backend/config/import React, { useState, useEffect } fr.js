import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Package, Trash2, Edit, Save, X } from 'lucide-react';

// --- Mock API / Backend ---
const initialProducts = [
  { id: 1, name: 'Wireless Mechanical Keyboard', price: 129.99, category: 'Electronics', description: 'Premium tactile mechanical keyboard with wireless connectivity and RGB lighting.' },
  { id: 2, name: 'Organic Cotton T-Shirt', price: 35.0, category: 'Apparel', description: '100% organic cotton, naturally dyed, comfortable fit for everyday wear.' },
  { id: 3, name: 'Stainless Steel Water Bottle', price: 24.5, category: 'Home Goods', description: 'Double-walled, vacuum insulated bottle keeps drinks cold for 24 hours.' },
];

let globalProducts = initialProducts;
let nextProductId = 4;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const mockApi = {
  login: async (email, password) => {
    await delay(500);
    if (email === 'user@example.com' && password === 'password') {
      const token = 'mock-jwt-' + Math.random().toString(36).substring(2, 15);
      return { success: true, user: { email, name: 'Test User' }, token };
    }
    return { success: false, message: 'Invalid credentials. Use user@example.com / password.' };
  },
  register: async () => ({ success: true, message: 'Registration successful! Please log in.' }),
  getProducts: async () => ({ success: true, data: globalProducts }),
  createProduct: async (data, token) => {
    if (!token) return { success: false, message: 'Auth required' };
    const newProduct = { ...data, id: nextProductId++ };
    globalProducts.push(newProduct);
    return { success: true, data: newProduct, message: 'Product added successfully' };
  },
  updateProduct: async (id, data, token) => {
    if (!token) return { success: false, message: 'Auth required' };
    const index = globalProducts.findIndex((p) => p.id === id);
    if (index === -1) return { success: false, message: 'Product not found' };
    globalProducts[index] = { ...globalProducts[index], ...data };
    return { success: true, data: globalProducts[index], message: 'Product updated successfully' };
  },
  deleteProduct: async (id, token) => {
    if (!token) return { success: false, message: 'Auth required' };
    const lengthBefore = globalProducts.length;
    globalProducts = globalProducts.filter((p) => p.id !== id);
    if (globalProducts.length < lengthBefore) return { success: true, message: `Product ${id} deleted` };
    return { success: false, message: 'Product not found' };
  },
};

// --- Message Alert ---
const MessageAlert = ({ message, type, onClose }) => {
  if (!message) return null;
  const baseClasses = "fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 flex items-center transition-opacity duration-300";
  const colorClasses = type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <p className="font-medium mr-4">{message}</p>
      <button onClick={onClose} className="ml-auto text-white opacity-75 hover:opacity-100">
        <X size={20} />
      </button>
    </div>
  );
};

// --- Product Form ---
const ProductForm = ({ editingProduct, setEditingProduct, fetchProducts, token, showMessage }) => {
  const isEditMode = editingProduct && editingProduct.id != null;
  const initialFormState = isEditMode
    ? editingProduct
    : { name: '', price: 0, category: '', description: '' };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(initialFormState); // Reset when editingProduct changes
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = isEditMode
      ? await mockApi.updateProduct(editingProduct.id, formData, token)
      : await mockApi.createProduct(formData, token);
    setIsLoading(false);
    if (result.success) {
      showMessage(result.message, 'success');
      setEditingProduct(null);
      fetchProducts();
    } else showMessage(result.message, 'error');
  };

  const categories = ['Electronics', 'Apparel', 'Home Goods', 'Books', 'Tools'];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-40">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-extrabold mb-6 border-b pb-2">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={isLoading}
            >
              <X size={20} className="inline mr-2" /> Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full mr-2"></span>
              ) : isEditMode ? <Save size={20} className="inline mr-2" /> : <Package size={20} className="inline mr-2" />}
              {isLoading ? 'Processing...' : isEditMode ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Product Grid / Card ---
const ProductCard = ({ product, onEdit, onDelete }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
    <div>
      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">{product.category}</span>
      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
      <p className="text-2xl font-extrabold text-green-600 mb-4">${product.price.toFixed(2)}</p>
      <p className="text-gray-600 text-sm">{product.description}</p>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-3">
      <button onClick={() => onEdit(product)} className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100"><Edit size={20} /></button>
      <button onClick={() => onDelete(product.id)} className="p-2 text-red-600 hover:text-red-800 bg-red-50 rounded-full hover:bg-red-100"><Trash2 size={20} /></button>
    </div>
  </div>
);

const ProductGrid = ({ products, onEdit, onDelete }) => {
  if (!products.length) return <div className="text-center py-10 text-gray-500">No products found.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((p) => <ProductCard key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />)}
    </div>
  );
};

// --- Auth Form ---
const AuthForm = ({ setAuthState, showMessage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = isLogin ? await mockApi.login(email, password) : await mockApi.register(email, password);
    setIsLoading(false);
    if (result.success) {
      if (isLogin) {
        setAuthState({ isLoggedIn: true, user: result.user, token: result.token });
        localStorage.setItem('mockToken', result.token);
        showMessage('Login successful!', 'success');
      } else {
        showMessage(result.message, 'success');
        setIsLogin(true);
      }
    } else showMessage(result.message, 'error');
  };

  const icon = isLogin ? <LogIn size={20} className="mr-2" /> : <UserPlus size={20} className="mr-2" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">{isLogin ? 'Sign In' : 'Register Account'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500"
            placeholder="Email"
          />
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500"
            placeholder="Password"
          />
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            {isLoading ? <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full mr-2"></span> : icon}
            {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:text-blue-500 text-sm">
            {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
const App = () => {
  const [authState, setAuthState] = useState({ isLoggedIn: false, user: null, token: null });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const showMessage = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage({ text: '', type: '' }), 3000); };

  const fetchProducts = async () => {
    if (!authState.isLoggedIn) return;
    setIsProductsLoading(true);
    const result = await mockApi.getProducts();
    setIsProductsLoading(false);
    if (result.success) setProducts(result.data);
    else showMessage('Failed to load products', 'error');
  };

  useEffect(() => {
    const token = localStorage.getItem('mockToken');
    if (token) setAuthState({ isLoggedIn: true, user: { name: 'Test User', email: 'user@example.com' }, token });
  }, []);

  useEffect(() => { if (authState.isLoggedIn) fetchProducts(); }, [authState.isLoggedIn]);

  const handleLogout = () => { setAuthState({ isLoggedIn: false, user: null, token: null }); localStorage.removeItem('mockToken'); setProducts([]); showMessage('Logged out successfully', 'success'); };

  const handleDelete = async (id) => { if (!window.confirm('Are you sure?')) return; const result = await mockApi.deleteProduct(id, authState.token); if (result.success) { showMessage(result.message, 'success'); fetchProducts(); } else showMessage(result.message, 'error'); };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <MessageAlert message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: '' })} />
      {!authState.isLoggedIn ? (
        <AuthForm setAuthState={setAuthState} showMessage={showMessage} />
      ) : (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10 border-b pb-4">
            <h1 className="text-4xl font-extrabold flex items-center"><Package size={32} className="mr-3 text-blue-600" /> Product Management</h1>
            <div className="flex space-x-3">
              <button onClick={() => setEditingProduct({ id: null, name: '', price: 0, category: '', description: '' })} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"> <Package size={20} className="mr-2" /> Add Product </button>
              <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg"> <LogIn size={20} className="mr-2 rotate-180" /> Logout </button>
            </div>
          </div>
          {isProductsLoading ? <div className="flex justify-center items-center h-64"><div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div></div> : <ProductGrid products={products} onEdit={setEditingProduct} onDelete={handleDelete} />}
          {editingProduct !== null && <ProductForm editingProduct={editingProduct} setEditingProduct={setEditingProduct} fetchProducts={fetchProducts} token={authState.token} showMessage={showMessage} />}
        </div>
      )}
    </div>
  );
};

export default App;
