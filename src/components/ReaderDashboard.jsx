const ReaderDashboard = () => {
    return (
      <div className="max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">📖 Reader Dashboard</h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-sm text-gray-500">Stories Read</h4>
            <p className="text-2xl font-bold text-purple-600">12</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-sm text-gray-500">Bookmarks</h4>
            <p className="text-2xl font-bold text-purple-600">5</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-sm text-gray-500">Reading Time</h4>
            <p className="text-2xl font-bold text-purple-600">8h 45m</p>
          </div>
        </div>
  
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h4 className="font-semibold mb-2">📚 Recent Stories</h4>
          <ul className="text-sm text-gray-700 list-disc ml-4">
            <li>A Walk in the Rain</li>
            <li>The Forgotten Path</li>
            <li>Echoes of the Mind</li>
          </ul>
        </div>
  
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-2">❤️ Liked Stories</h4>
          <ul className="text-sm text-gray-700 list-disc ml-4">
            <li>She & The Sea</li>
            <li>Letters Never Sent</li>
            <li>The Clockmaker’s Son</li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default ReaderDashboard;
  