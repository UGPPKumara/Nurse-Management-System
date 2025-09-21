import React from 'react';
import { User, Users, Calendar } from 'lucide-react';

// In a real app, you would fetch these stats from your backend
const DUMMY_STATS = { nurses: 3, clients: 3, logs: 3 };

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-4 rounded-full text-white ${color}`}>
            <Icon className="h-8 w-8" />
        </div>
        <div className="ml-4">
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const DashboardHome = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={User} title="Total Nurses" value={DUMMY_STATS.nurses} color="bg-blue-500" />
            <StatCard icon={Users} title="Total Clients" value={DUMMY_STATS.clients} color="bg-green-500" />
            <StatCard icon={Calendar} title="Active Assignments" value={DUMMY_STATS.logs} color="bg-yellow-500" />
        </div>
    </div>
);

export default DashboardHome;