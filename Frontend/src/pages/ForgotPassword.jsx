import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// This assumes you have an API service set up as previously discussed
// import { forgotPassword } from '../services/api'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace with your actual API call
            await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            setMessage('A password reset link has been sent to your email.');
        } catch (error) {
            setMessage('Failed to send reset link. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
                <p className="text-center text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-emerald-500 rounded-md">
                        Send Reset Link
                    </button>
                </form>
                {message && <p className="text-center text-green-600">{message}</p>}
                <div className="text-center">
                    <button onClick={() => navigate('/login')} className="text-sm text-emerald-500 hover:underline">
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;