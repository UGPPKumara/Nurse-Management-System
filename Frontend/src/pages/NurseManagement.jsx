import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { getNurses, createNurse, updateNurse, deleteNurse } from '../services/api';
import NurseFormModal from '../components/NurseFormModal';

const NurseManagement = () => {
    const [nurses, setNurses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNurse, setEditingNurse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNursesData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getNurses();
            setNurses(data);
        } catch (error) {
            console.error("Failed to fetch nurses:", error);
            // Here you could set an error message to display to the user
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNursesData();
    }, [fetchNursesData]);

    const handleSave = async (nurseData) => {
        try {
            if (editingNurse) {
                await updateNurse(editingNurse.id, nurseData);
            } else {
                await createNurse(nurseData);
            }
            fetchNursesData(); // Re-fetch data to show the changes
        } catch (error) {
            console.error("Failed to save nurse:", error);
        } finally {
            setIsModalOpen(false);
            setEditingNurse(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this nurse?")) {
            try {
                await deleteNurse(id);
                fetchNursesData(); // Re-fetch data
            } catch (error) {
                console.error("Failed to delete nurse:", error);
            }
        }
    };
    
    const handleOpenModal = (nurse = null) => {
        setEditingNurse(nurse);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Nurse Management</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-emerald-600">
                    <Plus className="h-5 w-5 mr-2" /> Add Nurse
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                {isLoading ? <p className="p-4 text-center">Loading...</p> : (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Contact</th>
                                <th className="py-3 px-6 text-left">License No.</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {nurses.map(nurse => (
                                <tr key={nurse.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{nurse.name}</td>
                                    <td className="py-3 px-6 text-left">{nurse.email}</td>
                                    <td className="py-3 px-6 text-left">{nurse.contact}</td>
                                    <td className="py-3 px-6 text-left">{nurse.licenseNumber}</td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center gap-4">
                                            <button onClick={() => handleOpenModal(nurse)} className="text-blue-500 hover:text-blue-700"><Edit className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(nurse.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {isModalOpen && <NurseFormModal nurse={editingNurse} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default NurseManagement;