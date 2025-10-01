import React from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  TestTube, 
  DollarSign, 
  BarChart3, 
  Settings,
  Home,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'patients', label: 'All Patients', icon: UserCheck },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
      doctor: [
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'patients', label: 'My Patients', icon: UserCheck },
        { id: 'treatments', label: 'Treatments', icon: FileText },
        { id: 'lab-results', label: 'Lab Results', icon: TestTube },
      ],
      reception: [
        { id: 'patients', label: 'Patient Management', icon: UserCheck },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'billing', label: 'Billing', icon: DollarSign },
      ],
      lab: [
        { id: 'lab-tests', label: 'Lab Tests', icon: TestTube },
        { id: 'results', label: 'Upload Results', icon: FileText },
      ],
    };

    return [
      ...commonItems,
      ...roleSpecificItems[user?.role || 'doctor'],
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">HMS</h1>
            <p className="text-sm text-gray-500">Hospital Management</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {(user?.firstName?.[0] ?? 'A')}{(user?.lastName?.[0] ?? 'A')}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;