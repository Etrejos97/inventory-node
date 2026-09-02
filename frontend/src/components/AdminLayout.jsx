import { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminCategories from './AdminCategories';
import AdminStatuses from './AdminStatuses';
import AdminResponsibles from './AdminResponsibles';
import AdminMovements from './AdminMovements';

const TABS = [
  { key: 'dashboard', label: '📊 Dashboard', component: AdminDashboard },
  { key: 'users', label: '👤 Usuarios', component: AdminUsers },
  { key: 'categories', label: '📂 Categorías', component: AdminCategories },
  { key: 'statuses', label: '🏷️ Estados', component: AdminStatuses },
  { key: 'responsibles', label: '👥 Responsables', component: AdminResponsibles },
  { key: 'movements', label: '📋 Historial', component: AdminMovements },
];

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const ActiveComponent = TABS.find((t) => t.key === activeTab)?.component || AdminDashboard;

  return (
    <div>
      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab${activeTab === tab.key ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ActiveComponent />
    </div>
  );
}
