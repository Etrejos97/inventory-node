export default function DataTable({ columns, items, onEdit, onDelete, emptyText }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th style={{ width: 100 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                {emptyText || 'No hay registros'}
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(item) : item[col.key] ?? '—'}
                  </td>
                ))}
                <td>
                  <button className="btn-icon" title="Editar" onClick={() => onEdit(item)}>✏️</button>
                  <button className="btn-icon" title="Eliminar" onClick={() => onDelete(item)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
