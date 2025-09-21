import React, { useState, useEffect, useMemo } from 'react';
import { Plus, User, Users, Home, Calendar, Clock, Download, Trash2, Edit, X, Save } from 'lucide-react';

// --- MOCK DATA (Simulating MongoDB/MySQL Database) ---
// In a real application, this data would come from your backend API connected to a database like MySQL.
const initialNurses = [
    { _id: 'NUR001', name: 'Alice Johnson', contact: '123-456-7890', specialization: 'Pediatrics', email: 'alice.j@health.com', licenseNumber: 'RN12345', hireDate: '2023-01-15' },
    { _id: 'NUR002', name: 'Bob Williams', contact: '234-567-8901', specialization: 'Geriatrics', email: 'bob.w@health.com', licenseNumber: 'RN67890', hireDate: '2022-11-20' },
    { _id: 'NUR003', name: 'Catherine Brown', contact: '345-678-9012', specialization: 'Cardiology', email: 'catherine.b@health.com', licenseNumber: 'RN54321', hireDate: '2023-05-10' },
];

const initialClients = [
    { _id: 'CLI001', name: 'John Doe', address: '123 Maple St, Springfield', contact: '555-0101', dateOfBirth: '1955-06-20', emergencyContact: 'Sarah Doe - 555-0111', allergies: 'Penicillin', notes: 'Recently discharged after hip replacement. Needs help with mobility and medication reminders.' },
    { _id: 'CLI002', name: 'Jane Smith', address: '456 Oak Ave, Shelbyville', contact: '555-0102', dateOfBirth: '1962-11-15', emergencyContact: 'Mike Smith - 555-0112', allergies: 'None', notes: 'Manages diabetes with insulin injections. Requires monitoring of blood sugar levels twice daily.' },
    { _id: 'CLI003', name: 'Peter Jones', address: '789 Pine Ln, Capital City', contact: '555-0103', dateOfBirth: '1948-03-30', emergencyContact: 'Linda Jones - 555-0113', allergies: 'Shellfish', notes: 'Recovering from a mild stroke. Needs assistance with speech therapy exercises and meal preparation.' },
];

const initialLogs = [
    { _id: 'LOG001', nurseId: 'NUR001', clientId: 'CLI002', date: '2025-09-22', time: '09:00', notes: '' },
    { _id: 'LOG002', nurseId: 'NUR002', clientId: 'CLI003', date: '2025-09-22', time: '11:00', notes: '' },
    { _id: 'LOG003', nurseId: 'NUR001', clientId: 'CLI001', date: '2025-09-23', time: '14:00', notes: '' },
];

// --- HELPER FUNCTIONS ---
const generateId = (prefix) => `${prefix}${Date.now()}${Math.floor(Math.random() * 100)}`;

// --- MAIN APP COMPONENT ---
export default function App() {
    const [view, setView] = useState('dashboard');
    const [nurses, setNurses] = useState(initialNurses);
    const [clients, setClients] = useState(initialClients);
    const [dailyLogs, setDailyLogs] = useState(initialLogs);

    // --- CRUD OPERATIONS (Simulating Backend API calls) ---

    // Nurse Management
    const addNurse = (nurse) => {
        const newNurse = { ...nurse, _id: generateId('NUR') };
        setNurses([...nurses, newNurse]);
    };
    const updateNurse = (updatedNurse) => {
        setNurses(nurses.map(n => n._id === updatedNurse._id ? updatedNurse : n));
    };
    const deleteNurse = (id) => {
        setDailyLogs(dailyLogs.filter(log => log.nurseId !== id));
        setNurses(nurses.filter(n => n._id !== id));
    };

    // Client Management
    const addClient = (client) => {
        const newClient = { ...client, _id: generateId('CLI') };
        setClients([...clients, newClient]);
    };
    const updateClient = (updatedClient) => {
        setClients(clients.map(c => c._id === updatedClient._id ? updatedClient : c));
    };
    const deleteClient = (id) => {
        setDailyLogs(dailyLogs.filter(log => log.clientId !== id));
        setClients(clients.filter(c => c._id !== id));
    };
    
    // Daily Log Management
    const addDailyLog = (log) => {
        const newLog = { ...log, _id: generateId('LOG') };
        setDailyLogs([...dailyLogs, newLog]);
    };
    const deleteDailyLog = (id) => {
        setDailyLogs(dailyLogs.filter(log => log._id !== id));
    };

    // Export Data
    const exportAllData = () => {
        const data = {
            nurses,
            clients,
            dailyLogs
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nurse_management_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <DashboardView stats={{ nurses: nurses.length, clients: clients.length, logs: dailyLogs.length }} />;
            case 'nurses':
                return <NurseManagement nurses={nurses} onAdd={addNurse} onUpdate={updateNurse} onDelete={deleteNurse} />;
            case 'clients':
                return <ClientManagement clients={clients} onAdd={addClient} onUpdate={updateClient} onDelete={deleteClient} />;
            case 'logs':
                return <DailyLogManagement logs={dailyLogs} nurses={nurses} clients={clients} onAdd={addDailyLog} onDelete={deleteDailyLog} />;
            default:
                return <DashboardView stats={{ nurses: nurses.length, clients: clients.length, logs: dailyLogs.length }} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar setView={setView} currentView={view} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header exportAllData={exportAllData} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
}

// --- LAYOUT COMPONENTS ---
const Sidebar = ({ setView, currentView }) => {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'nurses', icon: User, label: 'Nurse Management' },
        { id: 'clients', icon: Users, label: 'Client Management' },
        { id: 'logs', icon: Calendar, label: 'Daily Logs' },
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
                    <li key={item.id} className="px-2 md:px-0">
                        <a
                            href="#"
                            onClick={() => setView(item.id)}
                            className={`flex items-center justify-center md:justify-start py-3 my-1 md:px-6 rounded-lg transition-colors duration-200 ${
                                currentView === item.id 
                                ? 'bg-emerald-500 text-white' 
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="ml-4 hidden md:block">{item.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const Header = ({ exportAllData }) => (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-4 md:px-8">
         <button onClick={exportAllData} className="flex items-center bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-200">
            <Download className="h-5 w-5 mr-2" />
            Export All Data
        </button>
    </header>
);

// --- VIEW COMPONENTS ---
const DashboardView = ({ stats }) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={User} title="Total Nurses" value={stats.nurses} color="bg-blue-500" />
            <StatCard icon={Users} title="Total Clients" value={stats.clients} color="bg-green-500" />
            <StatCard icon={Calendar} title="Active Assignments" value={stats.logs} color="bg-yellow-500" />
        </div>
    </div>
);

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

const NurseManagement = ({ nurses, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNurse, setEditingNurse] = useState(null);

    const handleOpenModal = (nurse = null) => {
        setEditingNurse(nurse);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingNurse(null);
        setIsModalOpen(false);
    };

    const handleSave = (nurseData) => {
        if (editingNurse) {
            onUpdate({ ...editingNurse, ...nurseData });
        } else {
            onAdd(nurseData);
        }
        handleCloseModal();
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Nurse Management</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-200">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Nurse
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Contact</th>
                            <th className="py-3 px-6 text-left">License No.</th>
                            <th className="py-3 px-6 text-left">Specialization</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {nurses.map(nurse => (
                            <tr key={nurse._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{nurse.name}</td>
                                <td className="py-3 px-6 text-left">{nurse.email}</td>
                                <td className="py-3 px-6 text-left">{nurse.contact}</td>
                                <td className="py-3 px-6 text-left">{nurse.licenseNumber}</td>
                                <td className="py-3 px-6 text-left">{nurse.specialization}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center gap-4">
                                        <button onClick={() => handleOpenModal(nurse)} className="text-blue-500 hover:text-blue-700"><Edit className="w-5 h-5"/></button>
                                        <button onClick={() => onDelete(nurse._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <NurseFormModal nurse={editingNurse} onSave={handleSave} onClose={handleCloseModal} />}
        </div>
    );
};

const NurseFormModal = ({ nurse, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: nurse?.name || '',
        contact: nurse?.contact || '',
        email: nurse?.email || '',
        licenseNumber: nurse?.licenseNumber || '',
        hireDate: nurse?.hireDate || '',
        specialization: nurse?.specialization || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col max-h-[95vh]">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{nurse ? 'Edit Nurse' : 'Add New Nurse'}</h2>
                    <button onClick={onClose}><X className="h-6 w-6 text-gray-500 hover:text-gray-800" /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <form id="nurse-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                             <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">Contact Number</label>
                                <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="licenseNumber">License No.</label>
                                <input type="text" id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                             <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialization">Specialization</label>
                                <input type="text" id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hireDate">Hire Date</label>
                                <input type="date" id="hireDate" name="hireDate" value={formData.hireDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex justify-end gap-4 p-4 bg-gray-50 border-t">
                    <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400">Cancel</button>
                    <button type="submit" form="nurse-form" className="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 flex items-center"><Save className="h-5 w-5 mr-2" /> Save</button>
                </div>
            </div>
        </div>
    );
};

const ClientManagement = ({ clients, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    const handleOpenModal = (client = null) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingClient(null);
        setIsModalOpen(false);
    };
    
    const handleSave = (clientData) => {
        if(editingClient) {
            onUpdate({ ...editingClient, ...clientData });
        } else {
            onAdd(clientData);
        }
        handleCloseModal();
    };
    
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-200">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Client
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                         <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Address</th>
                            <th className="py-3 px-6 text-left">Contact</th>
                            <th className="py-3 px-6 text-left">Emergency Contact</th>
                            <th className="py-3 px-6 text-left">Allergies</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {clients.map(client => (
                            <tr key={client._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{client.name}</td>
                                <td className="py-3 px-6 text-left">{client.address}</td>
                                <td className="py-3 px-6 text-left">{client.contact}</td>
                                <td className="py-3 px-6 text-left">{client.emergencyContact}</td>
                                <td className="py-3 px-6 text-left">{client.allergies}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center gap-4">
                                        <button onClick={() => handleOpenModal(client)} className="text-blue-500 hover:text-blue-700"><Edit className="w-5 h-5"/></button>
                                        <button onClick={() => onDelete(client._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ClientFormModal client={editingClient} onSave={handleSave} onClose={handleCloseModal} />}
        </div>
    );
};

const ClientFormModal = ({ client, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: client?.name || '',
        address: client?.address || '',
        contact: client?.contact || '',
        dateOfBirth: client?.dateOfBirth || '',
        emergencyContact: client?.emergencyContact || '',
        allergies: client?.allergies || '',
        notes: client?.notes || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[95vh]">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{client ? 'Edit Client' : 'Add New Client'}</h2>
                    <button onClick={onClose}><X className="h-6 w-6 text-gray-500 hover:text-gray-800" /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <form id="client-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">Date of Birth</label>
                                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                            <div className="mb-4 md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">Address</label>
                                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">Contact Number</label>
                                <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergencyContact">Emergency Contact</label>
                                <input type="text" id="emergencyContact" name="emergencyContact" value={formData.emergencyContact} placeholder="Name - Phone" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                             <div className="mb-4 md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allergies">Allergies</label>
                                <input type="text" id="allergies" name="allergies" value={formData.allergies} placeholder="e.g., Penicillin, Shellfish" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div className="mb-4 md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">Client Notes</label>
                                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex justify-end gap-4 p-4 bg-gray-50 border-t">
                    <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400">Cancel</button>
                    <button type="submit" form="client-form" className="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 flex items-center"><Save className="h-5 w-5 mr-2"/> Save</button>
                </div>
            </div>
        </div>
    );
};

const DailyLogManagement = ({ logs, nurses, clients, onAdd, onDelete }) => {
    const [formData, setFormData] = useState({
        nurseId: '',
        clientId: '',
        date: '',
        time: '',
    });

    const enrichedLogs = useMemo(() => {
        return logs
            .map(log => {
                const nurse = nurses.find(n => n._id === log.nurseId);
                const client = clients.find(c => c._id === log.clientId);
                return {
                    ...log,
                    nurseName: nurse ? nurse.name : 'N/A',
                    clientName: client ? client.name : 'N/a',
                    clientAddress: client ? client.address : 'N/A',
                };
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date) || a.time.localeCompare(b.time));
    }, [logs, nurses, clients]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.nurseId || !formData.clientId || !formData.date || !formData.time) {
            // Replaced alert with a more user-friendly notification system if available
            console.error('Please fill out all fields.');
            return;
        }
        onAdd(formData);
        setFormData({ nurseId: '', clientId: '', date: '', time: '' });
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Daily Log Management</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Assign Nurse to Client</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                        <label htmlFor="nurseId" className="block text-sm font-medium text-gray-700">Nurse</label>
                        <select id="nurseId" name="nurseId" value={formData.nurseId} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md border" required>
                            <option value="">Select Nurse</option>
                            {nurses.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client</label>
                        <select id="clientId" name="clientId" value={formData.clientId} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md border" required>
                            <option value="">Select Client</option>
                            {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-1.5" required />
                    </div>
                     <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} className="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-1.5" required />
                    </div>
                    <button type="submit" className="flex items-center justify-center bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-200 w-full lg:w-auto">
                        <Plus className="h-5 w-5 mr-2" />
                        Add Log
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                 <table className="min-w-full leading-normal">
                    <thead>
                         <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Date & Time</th>
                            <th className="py-3 px-6 text-left">Nurse</th>
                            <th className="py-3 px-6 text-left">Client</th>
                            <th className="py-3 px-6 text-left">Client Address</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {enrichedLogs.map(log => (
                            <tr key={log._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-500"/>
                                        <span>{log.date}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <Clock className="w-4 h-4 mr-2"/>
                                        <span>{log.time}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left">{log.nurseName}</td>
                                <td className="py-3 px-6 text-left">{log.clientName}</td>
                                <td className="py-3 px-6 text-left">{log.clientAddress}</td>
                                <td className="py-3 px-6 text-center">
                                    <button onClick={() => onDelete(log._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

