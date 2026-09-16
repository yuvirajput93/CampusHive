import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';

const VerifyEmail=()=>{
    const { token } = useParams();
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [status, setStatus] = useState('Verifying your account...');

    useEffect(()=>{
        const verifyToken=async()=>{
        if (!token) {
            setStatus('Error: No verification token found in URL.');
            return;
        }

        try{
            const response = await apiClient.post(`/user/verify-email/${token}`);
            const userData = response.data.data;
            setUser(userData);
            setStatus('Success! You are now logged in. Redirecting to the feed...');
            
            setTimeout(() => {
                navigate('/feed');
            }, 2000);

        }catch(err){
            setStatus(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
        }
     };
     verifyToken();
    },[token, navigate, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold">{status}</h1>
            </div>
        </div>
    );
}

export default VerifyEmail;