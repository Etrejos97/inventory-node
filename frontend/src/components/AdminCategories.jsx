import { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
import DataTable from './DataTable';
import ModalForm from './ModalForm';

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
];

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await adminService.getCategories(); setItems(r.data); }
    catch { setError('Error al cargar'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); setForm({ name: '', description: '' }); setShowForm(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, description: item.description || '' }); setShowForm(true); };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (editItem) await adminService.updateCategory(editItem.id, form);
      else await adminService.createCategory(form);
      setShowForm(false); await load();
    } catch (err) { setError(err.response?.data?.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar categoría "${item.name}"?`)) return;
    try { await adminService.deleteCategory(item.id); await load(); }
    catch { setError('Error al eliminar'); }
  };

  const fields = [
    { name: 'name', label: 'Nombre', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', full: true },
  ];

  if (loading) return <div className="loading">Cargando categorías…</div>;

  return (
    <div>
      <div className="toolbar">
        <h2>Categorías</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Nueva categoría</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <DataTable columns={COLUMNS} items={items} onEdit={openEdit} onDelete={handleDelete} emptyText="No hay categorías" />
      {showForm && (
        <ModalForm title={editItem ? 'Editar categoría' : 'Nueva categoría'} fields={fields} data={form}
          onSave={handleSave} onCancel={() => setShowForm(false)} saving={saving} error={error} />
      )}
    </div>
  );
}
