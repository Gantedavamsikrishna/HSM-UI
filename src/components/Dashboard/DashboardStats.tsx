import React from "react";
import {
  Users,
  Calendar,
  TestTube,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DashboardStats as StatsType } from "../../types";

interface DashboardStatsProps {
  stats: StatsType;
  role: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, role }) => {
  const getStatsCards = () => {
    const baseCards = [
      {
        title: "Total Patients",
        value: stats.totalPatients,
        icon: Users,
        color: "bg-blue-500",
        change: "+12%",
        trend: "up" as const,
      },
      {
        title: "Today's Appointments",
        value: stats.todayAppointments,
        icon: Calendar,
        color: "bg-green-500",
        change: "+5%",
        trend: "up" as const,
      },
    ];

    const roleSpecificCards = {
      admin: [
        ...baseCards,
        {
          title: "Pending Tests",
          value: stats.pendingTests,
          icon: TestTube,
          color: "bg-yellow-500",
          change: "-8%",
          trend: "down" as const,
        },
        {
          title: "Monthly Revenue",
          value: `$${stats.totalRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: "bg-purple-500",
          change: "+15%",
          trend: "up" as const,
        },
      ],
      doctor: [
        ...baseCards,
        {
          title: "Pending Tests",
          value: stats.pendingTests,
          icon: TestTube,
          color: "bg-yellow-500",
          change: "-3%",
          trend: "down" as const,
        },
      ],
      reception: [
        ...baseCards,
        {
          title: "Monthly Revenue",
          value: `$${stats.totalRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: "bg-purple-500",
          change: "+18%",
          trend: "up" as const,
        },
      ],
      lab: [
        {
          title: "Total Tests",
          value: stats.totalPatients * 2,
          icon: TestTube,
          color: "bg-blue-500",
          change: "+7%",
          trend: "up" as const,
        },
        {
          title: "Pending Tests",
          value: stats.pendingTests,
          icon: TestTube,
          color: "bg-yellow-500",
          change: "-12%",
          trend: "down" as const,
        },
      ],
    };

    return (
      roleSpecificCards[role as keyof typeof roleSpecificCards] || baseCards
    );
  };

  const statsCards = getStatsCards();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              {/* <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendIcon className="w-4 h-4" />
                <span>{stat.change}</span>
              </div> */}
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
