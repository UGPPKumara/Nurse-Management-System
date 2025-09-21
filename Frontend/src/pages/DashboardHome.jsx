import React, { useState, useEffect } from 'react';
import { User, Users, Calendar, Clock } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getLogs, getNurses, getClients } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

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

const DashboardHome = () => {
    const [stats, setStats] = useState({ nurses: 0, clients: 0, logs: 0 });
    const [recentLogs, setRecentLogs] = useState([]);
    const [nurseSpecializations, setNurseSpecializations] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [logsData, nursesData, clientsData] = await Promise.all([
                    getLogs(),
                    getNurses(),
                    getClients()
                ]);

                setStats({
                    nurses: nursesData.length,
                    clients: clientsData.length,
                    logs: logsData.length
                });

                setRecentLogs(logsData.slice(0, 5));

                const specializations = nursesData.reduce((acc, nurse) => {
                    acc[nurse.specialization] = (acc[nurse.specialization] || 0) + 1;
                    return acc;
                }, {});
                setNurseSpecializations(specializations);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const pieChartData = {
        labels: Object.keys(nurseSpecializations),
        datasets: [{
            label: 'Nurses by Specialization',
            data: Object.values(nurseSpecializations),
            backgroundColor: ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#93C5FD', '#A78BFA'],
        }],
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading Dashboard...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={User} title="Total Nurses" value={stats.nurses} color="bg-blue-500" />
                <StatCard icon={Users} title="Total Clients" value={stats.clients} color="bg-green-500" />
                <StatCard icon={Calendar} title="Total Assignments" value={stats.logs} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Nurse Specializations</h2>
                    <Pie data={pieChartData} />
                </div>
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <tbody className="divide-y divide-gray-200">
                                {recentLogs.map(log => (
                                    <tr key={log.id}>
                                        <td className="p-3">
                                            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-500"/> {new Date(log.date).toLocaleDateString()}</div>
                                            <div className="flex items-center text-xs text-gray-500"><Clock className="w-3 h-3 mr-2 ml-1"/>{log.time}</div>
                                        </td>
                                        <td className="p-3 font-medium">{log.Nurse.name}</td>
                                        <td className="p-3 text-gray-600">assigned to</td>
                                        <td className="p-3 font-medium">{log.Client.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;