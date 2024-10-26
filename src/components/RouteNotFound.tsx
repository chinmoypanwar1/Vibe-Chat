import React from 'react';
import Link from 'next/link';

const RouteNotFound = ({redirectURL} : {redirectURL: string}) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! You weren't meant to be here.
        </h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or another error occurred.
        </p>
        <Link href={`${redirectURL}`} className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default RouteNotFound;
