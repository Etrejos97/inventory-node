import { useState } from 'react';
import { X, CheckCircle2, ShoppingCart, Trash2, ClipboardList, Monitor } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatCurrency = (v) =>
  v != null ? `$${Number(v).toLocaleString('es-CO')}` : '$0';

function CartItemThumb({ item }) {
  const [imgFailed, setImgFailed] = useState(false);
  if (item.imageUrl && !imgFailed) {
    return <img src={item.imageUrl} alt={item.name} onError={() => setImgFailed(true)} />;
  }
  return <Monitor size={22} />;
}

export default function Cart({ open, onClose }) {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalValue } = useCart();
  const [showQuote, setShowQuote] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);

  const handleQuote = () => {
    setShowQuote(true);
  };

  const confirmQuote = () => {
    setShowQuote(false);
    setQuoteSent(true);
    clearCart();
    setTimeout(() => {
      setQuoteSent(false);
      onClose();
    }, 2500);
  };

  if (!open) return null;

  return (
    <>
      <div className="cart-backdrop" onClick={onClose} />
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Carrito <span>({totalItems})</span></h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {quoteSent ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center',
          }}>
            <div style={{ color: 'var(--neon-green)', marginBottom: '1rem' }}><CheckCircle2 size={48} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--neon-green)' }}>
              ¡Cotización solicitada!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Te contactaremos pronto con los detalles.
            </p>
          </div>
        ) : (
          <div className="cart-items">
            {items.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon"><ShoppingCart size={48} /></div>
                <p>El carrito está vacío</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Agrega productos desde la tienda</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-thumb">
                    <CartItemThumb item={item} />
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-category">{item.categoryName}</p>
                    <div className="cart-item-controls">
                      <button
                        className="cart-item-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >−</button>
                      <span className="cart-item-qty">{item.quantity}</span>
                      <button
                        className="cart-item-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >+</button>
                      <span className="cart-item-price">
                        {formatCurrency((item.purchaseValue || 0) * item.quantity)}
                      </span>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeItem(item.id)}
                        title="Eliminar"
                      ><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {items.length > 0 && !quoteSent && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">{formatCurrency(totalValue)}</span>
            </div>
            <div className="cart-actions">
              <button className="btn btn-secondary" onClick={clearCart}>
                Vaciar
              </button>
              <button className="btn btn-primary" onClick={handleQuote}>
                Solicitar cotización
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quote confirmation modal */}
      {showQuote && (
        <div className="modal-overlay" onClick={() => setShowQuote(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h2 className="icon-inline"><ClipboardList size={20} /> Resumen de cotización</h2>
            <div style={{ marginBottom: '1rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.6rem 0', borderBottom: '1px solid var(--border-light)',
                  fontSize: '0.85rem',
                }}>
                  <span>
                    <strong>{item.name}</strong> × {item.quantity}
                  </span>
                  <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>
                    {formatCurrency((item.purchaseValue || 0) * item.quantity)}
                  </span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.75rem 0', marginTop: '0.5rem',
                fontSize: '1rem', fontWeight: 700,
              }}>
                <span>Total</span>
                <span style={{ color: 'var(--neon-cyan)' }}>{formatCurrency(totalValue)}</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Al confirmar, se enviará tu solicitud de cotización. Te contactaremos por los datos registrados.
            </p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setShowQuote(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary icon-inline" onClick={confirmQuote}>
                <CheckCircle2 size={16} /> Confirmar cotización
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
