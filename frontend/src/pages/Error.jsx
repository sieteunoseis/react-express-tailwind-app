import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold text-red-500">Something Went Wrong</h1>
      <p className="mt-4 text-lg text-gray-600">
        We encountered an error while processing your request. Please try again later.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg hover:bg-blue-600 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default ErrorPage;