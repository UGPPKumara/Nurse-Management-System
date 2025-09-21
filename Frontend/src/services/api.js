const API_URL = 'http://localhost:5000/api';

// A helper function to handle requests
const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['x-auth-token'] = token;
    }

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    
    // For DELETE requests which have no content
    if (response.status === 204) {
        return null;
    }
    
    return response.json();
};

// --- Nurse API ---
export const getNurses = () => request('/nurses');
export const createNurse = (data) => request('/nurses', { method: 'POST', body: JSON.stringify(data) });
export const updateNurse = (id, data) => request(`/nurses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNurse = (id) => request(`/nurses/${id}`, { method: 'DELETE' });

// --- Client API ---
export const getClients = () => request('/clients');
export const createClient = (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) });
export const updateClient = (id, data) => request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteClient = (id) => request(`/clients/${id}`, { method: 'DELETE' });

// --- Daily Log API ---
export const getLogs = () => request('/logs');
export const createLog = (data) => request('/logs', { method: 'POST', body: JSON.stringify(data) });
export const deleteLog = (id) => request(`/logs/${id}`, { method: 'DELETE' });