import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { getLogs, createLog, deleteLog, getNurses, getClients } from '../services/api';

const DailyLogManagement = () => {
    const [logs, setLogs] = useState([]);
    const [nurses, setNurses] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        nurseId: '',
        clientId: '',
        date: '',
        time: '',
    });

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [logsData, nursesData, clientsData] = await Promise.all([
                getLogs(),
                getNurses(),
                getClients()
            ]);
            setLogs(logsData);
            setNurses(nursesData);
            setClients(clientsData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createLog(formData);
            setFormData({ nurseId: '', clientId: '', date: '', time: '' }); // Reset form
            fetchData();
        } catch (error) {
            console.error("Failed to create log:", error);
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this log entry?")) {
            try {
                await deleteLog(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete log:", error);
            }
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Daily Log Management</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Assign Nurse to Client</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nurse</label>
                        <select name="nurseId" value={formData.nurseId} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border rounded-md" required>
                            <option value="">Select Nurse</option>
                            {nurses.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Client</label>
                        <select name="clientId" value={formData.clientId} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border rounded-md" required>
                            <option value="">Select Client</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border p-1.5 rounded-md" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Time</label>
                        <input type="time" name="time" value={formData.time} onChange={handleChange} className="mt-1 block w-full border p-1.5 rounded-md" required />
                    </div>
                    <button type="submit" className="flex items-center justify-center bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md w-full">
                        <Plus className="h-5 w-5 mr-2" /> Add Log
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                {isLoading ? <p className="p-4 text-center">Loading...</p> : (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">Date & Time</th>
                                <th className="py-3 px-6 text-left">Nurse</th>
                                <th className="py-3 px-6 text-left">Client</th>
                                <th className="py-3 px-6 text-left">Client Address</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {logs.map(log => (
                                <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">
                                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-2"/>{log.date}</div>
                                        <div className="flex items-center text-gray-500"><Clock className="w-4 h-4 mr-2"/>{log.time}</div>
                                    </td>
                                    <td className="py-3 px-6 text-left">{log.Nurse.name}</td>
                                    <td className="py-3 px-6 text-left">{log.Client.name}</td>
                                    <td className="py-3 px-6 text-left">{log.Client.address}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button onClick={() => handleDelete(log.id)} className="text-red-500"><Trash2 className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DailyLogManagement;