import { useState, useEffect } from 'react';
import api from '../utils/api';
import { TicketList } from '../components/TicketList';
import { Autocomplete } from '../components/Autocomplete';
import { Ticket, Bus } from 'lucide-react';

export const PassengerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [busType, setBusType] = useState('NON_AC');
  const [fare, setFare] = useState<number | null>(null);
  
  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data.tickets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCalculateFare = async () => {
    if (!source || !destination) return;
    try {
      const res = await api.post('/tickets/calculate-fare', { source, destination, busType });
      setFare(res.data.fare);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error calculating fare');
    }
  };

  const handleBookTicket = async () => {
    if (fare === null) return;
    try {
      await api.post('/tickets/book', { source, destination, busType, fare });
      alert('Ticket booked successfully!');
      setSource('');
      setDestination('');
      setFare(null);
      fetchTickets();
      window.location.reload(); 
    } catch (error: any) {
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-6">
            <Ticket className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-extrabold text-gray-800">Book Ticket</h3>
          </div>
          <div className="space-y-5">
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

            <button 
              onClick={handleCalculateFare} 
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl transition-colors"
            >
              Calculate Fare
            </button>
            
            {fare !== null && (
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="font-semibold text-gray-600">Total Fare</span>
                  <span className="text-3xl font-extrabold text-blue-600">₹{fare}</span>
                </div>
                <button 
                  onClick={handleBookTicket} 
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                >
                  Pay & Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <Bus className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-extrabold text-gray-800">My Tickets</h3>
          </div>
          <TicketList tickets={tickets} />
        </div>
      </div>
    </div>
  );
};
