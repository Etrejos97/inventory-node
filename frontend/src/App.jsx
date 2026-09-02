import { useState } from 'react';
import { Zap, ShoppingCart } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import Home from './components/Home';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import AdminLayout from './components/AdminLayout';
import Login from './components/Login';
import Cart from './components/Cart';

function getUserFromStorage() {
  try {
    const saved = localStorage.getItem('inventory_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function AppContent() {
  const [user, setUser] = useState(getUserFromStorage);
  const [page, setPage] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const handleLogin = (u) => {
    localStorage.setItem('inventory_user', JSON.stringify(u));
    setUser(u);
    setPage('inventory');
  };

  const handleLogout = () => {
    localStorage.removeItem('inventory_user');
    setUser(null);
    setPage('home');
  };

  const handleSave = () => {
    setShowForm(false);
    setEditItem(null);
    setRefreshKey((k) => k + 1);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  if (!user && (page === 'inventory' || page === 'admin')) {
    return (
      <Login
        onLogin={handleLogin}
        onBack={() => setPage('home')}
      />
    );
  }

  const navClass = (p) =>
    `btn nav-link${page === p ? ' nav-link--active' : ''}`;

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="icon-inline" onClick={() => setPage(user ? 'inventory' : 'home')}>
          <Zap size={20} /> INVENTORY
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {!user && (
            <button className={navClass('home')} onClick={() => setPage('home')}>
              Inicio
            </button>
          )}
          {user ? (
            <>
              <button className={navClass('inventory')} onClick={() => setPage('inventory')}>
                Inventario
              </button>
              <button className={navClass('admin')} onClick={() => setPage('admin')}>
                Admin
              </button>
              <span style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginLeft: '0.5rem',
                padding: '0.25rem 0.65rem',
                background: 'var(--glass-bg)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--glass-border)',
              }}>
                {user.fullName}
              </span>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                onClick={handleLogout}
              >
                Salir
              </button>
            </>
          ) : (
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setPage('inventory')}
            >
              Ingresar
            </button>
          )}
          <button
            className="btn"
            style={{
              background: cartOpen ? 'var(--neon-cyan-dim)' : 'transparent',
              color: '#fff',
              border: '1px solid var(--glass-border)',
              fontSize: '0.9rem',
              position: 'relative',
              padding: '0.4rem 0.7rem',
            }}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: 'var(--neon-pink)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: 18,
                height: 18,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(255,45,85,0.5)',
              }}>
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="content">
        {page === 'home' && !user && <Home />}

        {page === 'inventory' && user && (
          <>
            <div className="toolbar">
              <h2>Inventario</h2>
              <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowForm(true); }}>
                + Nuevo elemento
              </button>
            </div>
            <ItemList key={refreshKey} onEdit={handleEdit} onRefresh={() => setRefreshKey((k) => k + 1)} />
          </>
        )}

        {page === 'admin' && user && <AdminLayout />}
      </main>

      {showForm && (
        <ItemForm
          item={editItem}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
