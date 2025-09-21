import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { getClients, createClient, updateClient, deleteClient } from '../services/api';
import ClientFormModal from '../components/ClientFormModal';

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClientsData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getClients();
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClientsData();
    }, [fetchClientsData]);

    const handleSave = async (clientData) => {
        try {
            if (editingClient) {
                await updateClient(editingClient.id, clientData);
            } else {
                await createClient(clientData);
            }
            fetchClientsData();
        } catch (error) {
            console.error("Failed to save client:", error);
        } finally {
            setIsModalOpen(false);
            setEditingClient(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            try {
                await deleteClient(id);
                fetchClientsData();
            } catch (error) {
                console.error("Failed to delete client:", error);
            }
        }
    };
    
    const handleOpenModal = (client = null) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-emerald-600">
                    <Plus className="h-5 w-5 mr-2" /> Add Client
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                {isLoading ? <p className="p-4 text-center">Loading...</p> : (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Address</th>
                                <th className="py-3 px-6 text-left">Contact</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {clients.map(client => (
                                <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{client.name}</td>
                                    <td className="py-3 px-6 text-left">{client.address}</td>
                                    <td className="py-3 px-6 text-left">{client.contact}</td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center gap-4">
                                            <button onClick={() => handleOpenModal(client)} className="text-blue-500"><Edit className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(client.id)} className="text-red-500"><Trash2 className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {isModalOpen && <ClientFormModal client={editingClient} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default ClientManagement;