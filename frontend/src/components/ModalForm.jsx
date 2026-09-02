export default function ModalForm({ title, fields, data, onSave, onCancel, saving, error, onChange }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    } else if (fields.find((f) => f.name === e.target.name)?.onChange) {
      const field = fields.find((f) => f.name === e.target.name);
      field.onChange(e);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {fields.map((f) => (
              <div key={f.name} className={`form-group ${f.full ? 'full' : ''}`}>
                <label>{f.label}{f.required ? ' *' : ''}</label>
                {f.type === 'select' ? (
                  <select name={f.name} value={data[f.name] ?? ''} onChange={handleChange} required={f.required}>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea name={f.name} value={data[f.name] ?? ''} onChange={handleChange} rows={3} />
                ) : f.type === 'checkbox' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                    <input
                      type="checkbox"
                      name={f.name}
                      checked={!!data[f.name]}
                      onChange={(e) => {
                        if (onChange) {
                          onChange(e);
                        }
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.checkLabel || ''}</span>
                  </div>
                ) : (
                  <input
                    type={f.type || 'text'}
                    name={f.name}
                    value={data[f.name] ?? ''}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required={f.required}
                    step={f.step}
                    min={f.min}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
