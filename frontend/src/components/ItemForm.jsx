import { useState, useEffect } from 'react';
import { itemService, categoryService, statusService } from '../api/axiosConfig';

const EMPTY = {
  name: '', description: '', serialNumber: '',
  categoryId: '', statusId: '1',
  acquisitionDate: '', location: '', purchaseValue: '', observations: '',
  stock: '', minStock: '',
};

export default function ItemForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!item;

  useEffect(() => {
    Promise.all([
      categoryService.getAll(),
      statusService.getAll(),
    ]).then(([cat, stat]) => {
      setCategories(cat.data);
      setStatuses(stat.data);
    });
  }, []);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        description: item.description || '',
        serialNumber: item.serialNumber || '',
        categoryId: item.categoryId?.toString() || '',
        statusId: item.statusId?.toString() || '1',
        acquisitionDate: item.acquisitionDate || '',
        location: item.location || '',
        purchaseValue: item.purchaseValue?.toString() || '',
        observations: item.observations || '',
        stock: item.stock?.toString() || '',
        minStock: item.minStock?.toString() || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        categoryId: parseInt(form.categoryId),
        statusId: parseInt(form.statusId),
        purchaseValue: form.purchaseValue ? parseFloat(form.purchaseValue) : null,
        acquisitionDate: form.acquisitionDate || null,
        stock: form.stock ? parseInt(form.stock) : 0,
        minStock: form.minStock ? parseInt(form.minStock) : 0,
      };

      if (isEditing) {
        await itemService.update(item.id, payload);
      } else {
        await itemService.create(payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Editar elemento' : 'Nuevo elemento'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Nombre *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                <option value="">Seleccionar…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Estado *</label>
              <select name="statusId" value={form.statusId} onChange={handleChange} required>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>No. Serie</label>
              <input name="serialNumber" value={form.serialNumber} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Fecha de adquisición</label>
              <input type="date" name="acquisitionDate" value={form.acquisitionDate} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Ubicación</label>
              <input name="location" value={form.location} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Valor de compra</label>
              <input type="number" step="0.01" min="0" name="purchaseValue"
                     value={form.purchaseValue} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input type="number" min="0" name="stock"
                     value={form.stock} onChange={handleChange}
                     placeholder="Cantidad disponible" />
            </div>

            <div className="form-group">
              <label>Stock mínimo</label>
              <input type="number" min="0" name="minStock"
                     value={form.minStock} onChange={handleChange}
                     placeholder="Alerta bajo stock" />
            </div>

            <div className="form-group full">
              <label>Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange} />
            </div>

            <div className="form-group full">
              <label>Observaciones</label>
              <textarea name="observations" value={form.observations} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
