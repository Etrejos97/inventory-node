import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { adminService } from '../api/adminService';
import DataTable from './DataTable';
import ModalForm from './ModalForm';

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'Nombre completo' },
  { key: 'position', label: 'Cargo' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Teléfono' },
  {
    key: 'isActive',
    label: 'Activo',
    render: (r) => (r.isActive
      ? <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} />
      : <XCircle size={18} style={{ color: 'var(--text-muted)' }} />),
  },
];

const FIELD_DEFS = [
  { name: 'fullName', label: 'Nombre completo', required: true },
  { name: 'position', label: 'Cargo' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Teléfono' },
];

export default function AdminResponsibles() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await adminService.getResponsibles(); setItems(r.data); }
    catch { setError('Error al cargar'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); setForm({ fullName: '', position: '', email: '', phone: '' }); setShowForm(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ fullName: item.fullName, position: item.position || '', email: item.email || '', phone: item.phone || '' }); setShowForm(true); };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (editItem) await adminService.updateResponsible(editItem.id, form);
      else await adminService.createResponsible(form);
      setShowForm(false); await load();
    } catch (err) { setError(err.response?.data?.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar responsable "${item.fullName}"?`)) return;
    try { await adminService.deleteResponsible(item.id); await load(); }
    catch { setError('Error al eliminar'); }
  };

  if (loading) return <div className="loading">Cargando responsables…</div>;

  return (
    <div>
      <div className="toolbar">
        <h2>Responsables</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo responsable</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <DataTable columns={COLUMNS} items={items} onEdit={openEdit} onDelete={handleDelete} emptyText="No hay responsables" />
      {showForm && (
        <ModalForm title={editItem ? 'Editar responsable' : 'Nuevo responsable'} fields={FIELD_DEFS} data={form}
          onSave={handleSave} onCancel={() => setShowForm(false)} saving={saving} error={error} />
      )}
    </div>
  );
}
