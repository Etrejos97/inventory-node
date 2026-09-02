import { useState, useEffect } from 'react';
import { itemService, categoryService } from '../api/axiosConfig';
import { useCart } from '../context/CartContext';

function ProductCard({ item }) {
  const { addItem } = useCart();
  const [imgFailed, setImgFailed] = useState(false);

  const formatCurrency = (v) =>
    v != null ? `$${Number(v).toLocaleString('es-CO')}` : null;

  const statusIcon = {
    Disponible: '✅',
    'En uso': '👤',
    'En mantenimiento': '🔧',
    'Dado de baja': '🚫',
  };

  const stock = item.stock ?? 0;
  const isAvailable = item.statusName === 'Disponible' && stock > 0;
  const isLow = isAvailable && item.minStock != null && stock > 0 && stock <= item.minStock;

  return (
    <div className="product-card">
      <div className="product-card__image">
        {item.imageUrl && !imgFailed ? (
          <img src={item.imageUrl} alt={item.name} onError={() => setImgFailed(true)} />
        ) : (
          <span className="product-card__emoji">🖥️</span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{item.name}</h3>
        {item.description && (
          <p className="product-card__desc">{item.description}</p>
        )}
        <div className="product-card__meta">
          <span className="product-card__category">{item.categoryName}</span>
          <span className="product-card__status">
            {statusIcon[item.statusName] || '📦'} {item.statusName}
          </span>
        </div>
        {item.purchaseValue && (
          <div className="product-card__price">{formatCurrency(item.purchaseValue)}</div>
        )}
        <div className="product-card__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {stock > 0 ? (
            <span className="product-card__serial" style={{ color: isLow ? 'var(--neon-orange)' : 'var(--neon-green)' }}>
              {stock} en stock{isLow ? ' ⚠️' : ''}
            </span>
          ) : (
            <span className="product-card__serial" style={{ color: 'var(--neon-pink)' }}>Agotado</span>
          )}
          {item.serialNumber && (
            <span className="product-card__serial">#{item.serialNumber}</span>
          )}
        </div>
        <button
          className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.85rem' }}
          disabled={!isAvailable}
          onClick={() => isAvailable && addItem(item)}
        >
          {isAvailable ? '🛒 Agregar al carrito' : stock === 0 ? 'Agotado' : 'No disponible'}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    Promise.all([
      itemService.getAll({}),
      categoryService.getAll(),
    ])
      .then(([itemsRes, catRes]) => {
        setItems(itemsRes.data);
        setCategories(catRes.data);
      })
      .catch(() => setError('Error al cargar productos'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? items
    : items.filter((i) => i.categoryId === Number(activeCategory));

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero__content">
          <div className="hero__badge">🔥 Ofertas exclusivas</div>
          <h1 className="hero__title">
            Tecnología que
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>impulsa tu mundo</span>
          </h1>
          <p className="hero__subtitle">
            Descubre los mejores equipos, periféricos gaming y soluciones 
            tecnológicas al mejor precio. Envío rápido y soporte experto.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#products" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}
               onClick={(e) => { e.preventDefault(); document.querySelector('.category-tabs')?.scrollIntoView({ behavior: 'smooth' }); }}>
              🛒 Ver productos
            </a>
            <button className="btn" style={{
              fontSize: '1rem', padding: '0.85rem 2rem',
              background: 'var(--glass-bg)',
              color: 'var(--text)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(8px)',
            }}>
              🎮 Gaming
            </button>
          </div>
          <div style={{
            marginTop: '2.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: '🚚', text: 'Envío nacional' },
              { icon: '🔒', text: 'Pago seguro' },
              { icon: '💬', text: 'Soporte 24/7' },
              { icon: '⭐', text: 'Garantía incluida' },
            ].map((item) => (
              <div key={item.text} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="category-tabs" id="products">
        <button
          className={`category-tab ${activeCategory === 'all' ? 'category-tab--active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === String(cat.id) ? 'category-tab--active' : ''}`}
            onClick={() => setActiveCategory(String(cat.id))}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">📦 Cargando productos…</div>
      ) : filtered.length === 0 ? (
        <div className="loading" style={{ padding: '4rem' }}>
          No hay productos en esta categoría
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
