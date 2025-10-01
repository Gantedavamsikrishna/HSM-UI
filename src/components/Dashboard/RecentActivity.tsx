import React from 'react';
import { Clock, User, Calendar, TestTube } from 'lucide-react';

interface Activity {
  id: string;
  type: 'appointment' | 'patient' | 'test' | 'billing';
  title: string;
  description: string;
  time: string;
  user?: string;
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'New Appointment Scheduled',
      description: 'Alice Williams scheduled for cardiology consultation',
      time: '2 minutes ago',
      user: 'Dr. Sarah Smith',
    },
    {
      id: '2',
      type: 'test',
      title: 'Lab Results Available',
      description: 'HbA1c test results for Robert Brown',
      time: '15 minutes ago',
      user: 'Lab Technician',
    },
    {
      id: '3',
      type: 'patient',
      title: 'Patient Registration',
      description: 'New patient Emma Davis registered',
      time: '1 hour ago',
      user: 'Mary Johnson',
    },
    {
      id: '4',
      type: 'billing',
      title: 'Payment Received',
      description: 'Invoice #INV-001 paid by Robert Brown',
      time: '2 hours ago',
      user: 'System',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'patient':
        return User;
      case 'test':
        return TestTube;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-100 text-blue-600';
      case 'patient':
        return 'bg-green-100 text-green-600';
      case 'test':
        return 'bg-yellow-100 text-yellow-600';
      case 'billing':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-600">Latest updates from your hospital</p>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                    {activity.user && (
                      <span className="text-xs text-gray-500">
                        by {activity.user}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;