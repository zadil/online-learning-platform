import React from 'react';

const AdminBootstrapSimple = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Configuration Initiale - Test
          </h2>
          <p className="text-gray-400 mb-6">
            Version simple pour test
          </p>
          
          <form className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Test Input
              </label>
              <input
                type="text"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg"
                placeholder="Test"
              />
            </div>
            
            <button
              type="button"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg"
            >
              Test Button
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminBootstrapSimple;