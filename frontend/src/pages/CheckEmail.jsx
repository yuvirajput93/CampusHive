import React from 'react';
import { FiMail } from 'react-icons/fi';

const CheckEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700 max-w-md">
        <FiMail className="mx-auto h-16 w-16 text-purple-400 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Check Your Inbox!</h1>
        <p className="text-gray-300">
          We've sent a verification link to your IIT (ISM) email address. Please click the link to activate your account.
        </p>
        <p className="text-gray-400 text-sm mt-4">
          (Don't forget to check your spam folder!)
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;