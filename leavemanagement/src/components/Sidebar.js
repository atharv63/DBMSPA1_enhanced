import React from 'react';

function Sidebar({ balance }) {
  if (!balance) return <div>Loading...</div>;

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Leave Balance</h2>
      <div className="space-y-4">
        {Object.entries(balance).map(([type, value]) => (
          typeof value === 'number' && (
            <div key={type} className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between">
                <span className="capitalize">{type.replace(/_/g, ' ')}:</span>
                <span>{value}/10</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(value/10)*100}%` }}
                ></div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default Sidebar;