import { useState } from 'react';

function WelcomeModal({ onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-sidebar-bg rounded-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Benvingut a BAUGPT</h1>
        <p className="text-gray-400 mb-6 text-center">
          Si us plau, introdueix el teu nom per començar
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="El teu nom..."
            className="w-full px-4 py-3 bg-chat-bg text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none mb-4"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            disabled={!name.trim()}
          >
            Començar
          </button>
        </form>
      </div>
    </div>
  );
}

export default WelcomeModal;
