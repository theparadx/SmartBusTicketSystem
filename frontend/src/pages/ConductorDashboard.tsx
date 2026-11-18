import { useState, useEffect } from 'react';
import { QRScanner } from '../components/QRScanner';
import api from '../utils/api';
import { Autocomplete } from '../components/Autocomplete';
import { ScanLine, Ticket, History } from 'lucide-react';

export const ConductorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'manual' | 'history'>('scan');
  const [history, setHistory] = useState([]);
  
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [busType, setBusType] = useState('NON_AC');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [fare, setFare] = useState<number | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/conductor/history');
      setHistory(res.data.validations);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const handleCalculateFare = async () => {
    if (!source || !destination) return;
    try {
      const res = await api.post('/conductor/calculate-fare', { source, destination, busType, adults, children });
      setFare(res.data.fare);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error calculating fare');
    }
  };

  const handleGenerateTicket = async () => {
    if (fare === null) return;
    try {
      await api.post('/conductor/manual-ticket', { source, destination, busType, adults, children, fare });
      alert('Traditional Ticket Generated!');
      setSource('');
      setDestination('');
      setAdults(1);
      setChildren(0);
      setFare(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate ticket');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex bg-white rounded-xl shadow-sm mb-6 p-2 space-x-2">
        <button 
          onClick={() => setActiveTab('scan')} 
          className={`flex-1 flex items-center justify-center py-3 rounded-lg font-bold transition-all ${activeTab === 'scan' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <ScanLine className="w-5 h-5 mr-2" /> Scan Ticket
        </button>
        <button 
          onClick={() => setActiveTab('manual')} 
          className={`flex-1 flex items-center justify-center py-3 rounded-lg font-bold transition-all ${activeTab === 'manual' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Ticket className="w-5 h-5 mr-2" /> Traditional Ticket
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex-1 flex items-center justify-center py-3 rounded-lg font-bold transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <History className="w-5 h-5 mr-2" /> History
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        {activeTab === 'scan' && (
          <QRScanner />
        )}

        {activeTab === 'manual' && (
          <div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-6">Generate Traditional Ticket</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Autocomplete label="Source Station" value={source} onChange={setSource} placeholder="Enter source" />
              <Autocomplete label="Destination Station" value={destination} onChange={setDestination} placeholder="Enter destination" />
              
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Bus Type</label>
                <select 
                  value={busType} 
                  onChange={(e) => setBusType(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="NON_AC">Non-AC</option>
                  <option value="AC">AC</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Adults</label>
                  <input 
                    type="number" 
                    min="1"
                    value={adults} 
                    onChange={(e) => setAdults(parseInt(e.target.value) || 0)} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Children</label>
                  <input 
                    type="number" 
                    min="0"
                    value={children} 
                    onChange={(e) => setChildren(parseInt(e.target.value) || 0)} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleCalculateFare} 
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl transition-colors"
              >
                Calculate Total Fare
              </button>
              
              {fare !== null && (
                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-semibold text-gray-600">Total Fare</span>
                    <span className="text-3xl font-extrabold text-blue-600">₹{fare}</span>
                  </div>
                  <button 
                    onClick={handleGenerateTicket} 
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-md transition-all"
                  >
                    Generate Ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-6">Validation History</h3>
            <div className="space-y-4">
              {history.length === 0 ? <p className="text-gray-500 text-center py-8">No validations yet.</p> : null}
              {history.map((val: any) => (
                <div key={val.id} className="border border-gray-100 bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between md:items-center">
                  <div>
                    <span className="font-bold text-gray-800 block text-lg">{val.ticket.source} &rarr; {val.ticket.destination}</span>
                    <span className="text-sm text-gray-600">Type: {val.ticket.busType} | Fare: ₹{val.ticket.fare}</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${val.ticket.userId ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                        {val.ticket.userId ? 'Scanner Capture' : 'Traditional'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 text-sm text-gray-500 font-medium">
                    {new Date(val.scannedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
