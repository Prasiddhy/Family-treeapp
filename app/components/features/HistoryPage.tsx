import React from 'react';

interface HistoryPageProps { history: Array<{ id: string; name: string; dob?: string }>; }

const HistoryPage: React.FC<HistoryPageProps> = ({ history }) => {
  if (history.length === 0) return <p className="p-4 text-white/70 text-center mt-16">No history yet.</p>;

  return (
    <div className="p-4 mt-16 mb-16 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
      {history.map(record => (
        <div key={record.id} className="p-5 bg-white/90 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer border border-purple-100">
          <p className="font-semibold text-purple-900">{record.name}</p>
          {record.dob && <p className="text-sm text-gray-600 mt-1">DOB: {record.dob}</p>}
        </div>
      ))}
    </div>
  );
};

export default HistoryPage;
