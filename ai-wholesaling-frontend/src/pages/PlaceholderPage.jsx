import React from 'react';

function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-96">
      <h1 className="text-3xl font-bold text-gray-400">{title} - Coming Soon</h1>
    </div>
  );
}

export default PlaceholderPage;