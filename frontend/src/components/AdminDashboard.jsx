import { useState, useEffect } from 'react';
import { Package, CheckCircle2, User, AlertTriangle, Ban, DollarSign, FolderOpen, Tag, Users, KeyRound } from 'lucide-react';
import { adminService } from '../api/adminService';

const formatCurrency = (value) =>
  value != null ? `$${Number(value).toLocaleString('es-CO')}` : '$0';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getDashboard()
      .then((r) => setStats(r.data))
      .catch(() => setError('Error al cargar estadísticas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Cargando estadísticas…</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!stats) return null;

  return (
    <div>
      <div className="toolbar">
        <h2>Dashboard</h2>
      </div>

      <div className="cards">
        <div className="card">
          <div className="card__icon card__icon--total"><Package size={24} /></div>
          <div className="card__body">
            <div className="card__value">{stats.totalItems}</div>
            <div className="card__label">Total productos</div>
          </div>
        </div>
        <div className="card">
          <div className="card__icon card__icon--total"><CheckCircle2 size={24} /></div>
          <div className="card__body">
            <div className="card__value">{stats.availableItems}</div>
            <div className="card__label">Disponibles</div>
          </div>
        </div>
        <div className="card">
          <div className="card__icon card__icon--total"><User size={24} /></div>
          <div className="card__body">
            <div className="card__value">{stats.inUseItems}</div>
            <div className="card__label">En uso</div>
          </div>
        </div>
        <div className="card">
          <div className="card__icon card__icon--warning"><AlertTriangle size={24} /></div>
          <div className="card__body">
            <div className="card__value">{stats.maintenanceItems}</div>
            <div className="card__label">En mantenimiento</div>
          </div>
        </div>
        <div className="card">
          <div className="card__icon card__icon--danger"><Ban size={24} /></div>
          <div className="card__body">
            <div className="card__value">{stats.retiredItems}</div>
            <div className="card__label">Dado de baja</div>
          </div>
        </div>
        <div className="card">
          <div className="card__icon card__icon--total"><DollarSign size={24} /></div>
          <div className="card__body">
            <div className="card__value">{formatCurrency(stats.totalValue)}</div>
            <div className="card__label">Valor total</div>
          </div>
        </div>
      </div>

      <div className="cards" style={{ marginTop: '1rem' }}>
        <div className="card">
          <div className="card__icon card__icon--total"><FolderOpen size={24} /></div>
          <div className="card__body">
            <div className="card__value">{stats.totalCategories}</div>
            <div className="card__label">Categorías</div>
          </div>
        </div>
        <div className="card">
          <div className="card__icon card__icon--total"><Tag size={24} /></div>
          <div className="card__body">
            <div className="card__value">{stats.totalStatuses}</div>
            <div className="card__label">Estados</div>
          </div>
        </div>
        <div className="card">
          <div className="card__icon card__icon--total"><Users size={24} /></div>
          <div className="card__body">
            <div className="card__value">{stats.totalResponsibles}</div>
            <div className="card__label">Responsables</div>
          </div>
        </div>
        <div className="card">
          <div className="card__icon card__icon--total"><KeyRound size={24} /></div>
          <div className="card__body">
            <div className="card__value">{stats.totalUsers}</div>
            <div className="card__label">Usuarios</div>
          </div>
        </div>
      </div>
    </div>
  );
}
