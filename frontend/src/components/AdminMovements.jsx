import { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';

const ACTION_LABELS = {
  CREATED: 'Creación',
  UPDATED: 'Actualización',
  DELETED: 'Eliminación',
};

export default function AdminMovements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await adminService.getMovements(); setItems(r.data); }
    catch { setError('Error al cargar historial'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('es-CO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return <div className="loading">Cargando historial…</div>;

  return (
    <div>
      <div className="toolbar">
        <h2>Historial de movimientos</h2>
        <button className="btn btn-secondary" onClick={load}>🔄 Actualizar</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Elemento</th>
              <th>Acción</th>
              <th>Campo</th>
              <th>Valor anterior</th>
              <th>Valor nuevo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No hay movimientos registrados
              </td></tr>
            ) : (
              items.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td><strong>{m.itemName}</strong></td>
                  <td><span className="badge badge--info">{ACTION_LABELS[m.action] || m.action}</span></td>
                  <td>{m.fieldName || '—'}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.oldValue || '—'}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.newValue || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(m.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
