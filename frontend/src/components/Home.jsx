import { useState, useEffect } from 'react';
import {
  CheckCircle2, User, Wrench, Ban, Package, AlertTriangle,
  ShoppingCart, Flame, Gamepad2, Truck, Lock, MessageCircle, Star, Monitor,
} from 'lucide-react';
import { itemService, categoryService } from '../api/axiosConfig';
import { useCart } from '../context/CartContext';

const STATUS_ICON = {
  Disponible: CheckCircle2,
  'En uso': User,
  'En mantenimiento': Wrench,
  'Dado de baja': Ban,
};

function ProductCard({ item }) {
  const { addItem } = useCart();
  const [imgFailed, setImgFailed] = useState(false);

  const formatCurrency = (v) =>
    v != null ? `$${Number(v).toLocaleString('es-CO')}` : null;

  const stock = item.stock ?? 0;
  const isAvailable = item.statusName === 'Disponible' && stock > 0;
  const isLow = isAvailable && item.minStock != null && stock > 0 && stock <= item.minStock;
  const StatusIcon = STATUS_ICON[item.statusName] || Package;

  return (
    <div className="product-card">
      <div className="product-card__image">
        {item.imageUrl && !imgFailed ? (
          <img src={item.imageUrl} alt={item.name} onError={() => setImgFailed(true)} />
        ) : (
          <span className="product-card__emoji"><Monitor size={64} /></span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{item.name}</h3>
        {item.description && (
          <p className="product-card__desc">{item.description}</p>
        )}
        <div className="product-card__meta">
          <span className="product-card__category">{item.categoryName}</span>
          <span className="product-card__status icon-inline">
            <StatusIcon size={14} /> {item.statusName}
          </span>
        </div>
        {item.purchaseValue && (
          <div className="product-card__price">{formatCurrency(item.purchaseValue)}</div>
        )}
        <div className="product-card__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {stock > 0 ? (
            <span className="product-card__serial icon-inline" style={{ color: isLow ? 'var(--neon-orange)' : 'var(--neon-green)' }}>
              {stock} en stock{isLow && <AlertTriangle size={13} />}
            </span>
          ) : (
            <span className="product-card__serial" style={{ color: 'var(--neon-pink)' }}>Agotado</span>
          )}
          {item.serialNumber && (
            <span className="product-card__serial">#{item.serialNumber}</span>
          )}
        </div>
        <button
          className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'} icon-inline`}
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.85rem' }}
          disabled={!isAvailable}
          onClick={() => isAvailable && addItem(item)}
        >
          {isAvailable
            ? <><ShoppingCart size={16} /> Agregar al carrito</>
            : stock === 0 ? 'Agotado' : 'No disponible'}
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
          <div className="hero__badge icon-inline"><Flame size={14} /> Ofertas exclusivas</div>
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
            <a href="#products" className="btn btn-primary icon-inline" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}
               onClick={(e) => { e.preventDefault(); document.querySelector('.category-tabs')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <ShoppingCart size={18} /> Ver productos
            </a>
            <button className="btn icon-inline" style={{
              fontSize: '1rem', padding: '0.85rem 2rem',
              background: 'var(--glass-bg)',
              color: 'var(--text)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(8px)',
            }}>
              <Gamepad2 size={18} /> Gaming
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
              { icon: Truck, text: 'Envío nacional' },
              { icon: Lock, text: 'Pago seguro' },
              { icon: MessageCircle, text: 'Soporte 24/7' },
              { icon: Star, text: 'Garantía incluida' },
            ].map((item) => (
              <div key={item.text} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}>
                <item.icon size={19} />
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
        <div className="loading icon-inline"><Package size={18} /> Cargando productos…</div>
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
