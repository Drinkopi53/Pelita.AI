import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Pelita<span className="text-blue-600">.AI</span></h1>
        <p className="text-sm text-gray-500">Sahabat Digital Anda untuk Menyelami Firman</p>
      </div>
    </header>
  );
};
