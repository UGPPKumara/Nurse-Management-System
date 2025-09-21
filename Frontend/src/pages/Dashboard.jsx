import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { Home, User, Users, Calendar, Plus, Download, LogOut } from 'lucide-react';

// Import your page components
import DashboardHome from './DashboardHome';
import NurseManagement from './NurseManagement';
import ClientManagement from './ClientManagement';
import DailyLogManagement from './DailyLogManagement';

// --- Reusable Layout Components ---
const Sidebar = () => {
    const location = useLocation();
    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/nurses', icon: User, label: 'Nurse Management' },
        { path: '/clients', icon: Users, label: 'Client Management' },
        { path: '/logs', icon: Calendar, label: 'Daily Logs' },
    ];

    return (
        <nav className="w-16 md:w-64 bg-gray-800 text-white flex flex-col">
            <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-700">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Plus className="text-white"/>
                </div>
                <span className="ml-4 text-lg font-bold hidden md:block">NurseLog</span>
            </div>
            <ul className="flex-1 mt-6">
                {navItems.map(item => (
                    <li key={item.path} className="px-2 md:px-0">
                        <Link
                            to={item.path}
                            className={`flex items-center justify-center md:justify-start py-3 my-1 md:px-6 rounded-lg transition-colors duration-200 ${
                                location.pathname === item.path
                                ? 'bg-emerald-500 text-white'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="ml-4 hidden md:block">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const Header = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    
    // We will implement this function later with API calls
    const exportAllData = () => {
        alert("Export functionality will be connected to the backend API.");
    };

    return (
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
            <button onClick={exportAllData} className="flex items-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200">
                <Download className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Export All Data</span>
            </button>
            <button onClick={handleLogout} className="flex items-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-200">
                <LogOut className="h-5 w-5 mr-0 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
            </button>
        </header>
    );
};


// --- Main Dashboard Component ---
export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/nurses" element={<NurseManagement />} />
                        <Route path="/clients" element={<ClientManagement />} />
                        <Route path="/logs" element={<DailyLogManagement />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}