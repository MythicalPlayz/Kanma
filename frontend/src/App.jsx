import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTowerBroadcast, faBolt, faRotate } from '@fortawesome/free-solid-svg-icons';

const socket = io('http://localhost:4000');

export default function App() {
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initial REST fetch
    fetch('http://localhost:4000/api/state')
      .then((res) => res.json())
      .then((data) => setState(data));

    // Socket listeners
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('stateUpdated', (updated) => setState(updated));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('stateUpdated');
    };
  }, []);

  const triggerServerUpdate = async () => {
    await fetch('http://localhost:4000/api/update', { method: 'POST' });
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-6">
        <header className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTowerBroadcast} className="text-indigo-400 text-xl" />
            <h1 className="font-semibold text-lg">Real-Time Hub</h1>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            connected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
          }`}>
            {connected ? 'Live' : 'Disconnected'}
          </span>
        </header>

        <section className="bg-slate-900 rounded-xl p-4 border border-slate-700/60 font-mono text-sm space-y-2">
          <p className="text-slate-400">Events Recorded: <span className="text-white font-bold">{state?.counter ?? 0}</span></p>
          <p className="text-slate-400">Last Sync: <span className="text-indigo-300">{state?.lastUpdated || 'None'}</span></p>
        </section>

        <button
          onClick={triggerServerUpdate}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition px-4 py-3 rounded-xl font-medium text-white shadow-lg cursor-pointer"
        >
          <FontAwesomeIcon icon={faBolt} />
          Trigger Global Broadcast
        </button>
      </div>
    </main>
  );
}