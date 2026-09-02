import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { adminService } from '../api/adminService';
import DataTable from './DataTable';
import ModalForm from './ModalForm';

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: 'Usuario' },
  { key: 'fullName', label: 'Nombre completo' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rol', render: (u) => u.role?.name },
  {
    key: 'isActive',
    label: 'Activo',
    render: (u) => (u.isActive
      ? <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} />
      : <XCircle size={18} style={{ color: 'var(--text-muted)' }} />),
  },
];

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([adminService.getUsers(), adminService.getRoles()]);
      setItems(uRes.data);
      setRoles(rRes.data);
    } catch { setError('Error al cargar usuarios'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ username: '', password: '', fullName: '', email: '', roleId: roles[0]?.id || '', isActive: true });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      username: item.username,
      password: '',
      fullName: item.fullName,
      email: item.email || '',
      roleId: item.role?.id || '',
      isActive: item.isActive,
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        await adminService.updateUser(editItem.id, form);
      } else {
        await adminService.createUser(form);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar usuario "${item.username}"?`)) return;
    try {
      await adminService.deleteUser(item.id);
      await load();
    } catch { setError('Error al eliminar'); }
  };

  const fields = [
    { name: 'username', label: 'Usuario', required: true },
    { name: 'password', label: 'Contraseña', placeholder: editItem ? 'Dejar vacío para mantener' : '', required: !editItem },
    { name: 'fullName', label: 'Nombre completo', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'roleId', label: 'Rol', type: 'select', required: true, options: roles.map((r) => ({ value: r.id, label: r.name })) },
    { name: 'isActive', label: 'Activo', type: 'checkbox', checkLabel: 'Usuario activo' },
  ];

  if (loading) return <div className="loading">Cargando usuarios…</div>;

  return (
    <div>
      <div className="toolbar">
        <h2>Usuarios</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo usuario</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <DataTable columns={COLUMNS} items={items} onEdit={openEdit} onDelete={handleDelete} emptyText="No hay usuarios registrados" />
      {showForm && (
        <ModalForm
          title={editItem ? 'Editar usuario' : 'Nuevo usuario'}
          fields={fields}
          data={form}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          saving={saving}
          error={error}
        />
      )}
    </div>
  );
}
