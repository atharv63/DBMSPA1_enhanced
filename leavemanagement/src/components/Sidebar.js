import React from 'react';

function Sidebar({ balance }) {
  if (!balance) {
    return (
      <div className="w-64 bg-gray-800 text-white p-4 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-6 w-24 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex-shrink-0 hidden md:block">
      <h2 className="text-xl font-bold mb-6 text-gray-100">Leave Balance</h2>
      <div className="space-y-4">
        {Object.entries(balance).map(([type, value]) => (
          typeof value === 'number' && (
            <div key={type} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="capitalize font-medium text-gray-200">
                  {type.replace(/_/g, ' ')}
                </span>
                <span className="font-bold text-white">
                  {value}/10
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${(value/10)*100}%` }}
                ></div>
              </div>
            </div>
          )
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;