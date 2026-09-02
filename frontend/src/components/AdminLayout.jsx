import { useState } from 'react';
import { LayoutDashboard, User, FolderOpen, Tag, Users, ClipboardList } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminCategories from './AdminCategories';
import AdminStatuses from './AdminStatuses';
import AdminResponsibles from './AdminResponsibles';
import AdminMovements from './AdminMovements';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: AdminDashboard },
  { key: 'users', label: 'Usuarios', icon: User, component: AdminUsers },
  { key: 'categories', label: 'Categorías', icon: FolderOpen, component: AdminCategories },
  { key: 'statuses', label: 'Estados', icon: Tag, component: AdminStatuses },
  { key: 'responsibles', label: 'Responsables', icon: Users, component: AdminResponsibles },
  { key: 'movements', label: 'Historial', icon: ClipboardList, component: AdminMovements },
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
            className={`admin-tab icon-inline${activeTab === tab.key ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>
      <ActiveComponent />
    </div>
  );
}
