import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

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
        setFormData(prev => ({ ...prev, [name]: value }));
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
                                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div className="mb-4 md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Contact</label>
                                <input type="tel" name="contact" value={formData.contact} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Emergency Contact</label>
                                <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                             <div className="mb-4 md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Allergies</label>
                                <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="mb-4 md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Client Notes</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-lg"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex justify-end gap-4 p-4 bg-gray-50 border-t">
                    <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" form="client-form" className="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center"><Save className="h-5 w-5 mr-2"/> Save</button>
                </div>
            </div>
        </div>
    );
};

export default ClientFormModal;