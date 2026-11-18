import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CreditCard, Wallet } from 'lucide-react';

export const AddMoney = () => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const navigate = useNavigate();

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return alert('Invalid amount');
    if (!cardNumber || !cvv || !expiry) return alert('Please fill simulated card details');

    try {
      await api.post('/wallet/deposit', { amount: parseFloat(amount) });
      alert('Money added successfully');
      navigate('/passenger/profile');
    } catch (error) {
      alert('Failed to add money');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-6">
        <Wallet className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-extrabold text-gray-800">Add Money</h2>
      </div>
      
      <form onSubmit={handleAddMoney} className="space-y-5">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">Amount to Add (₹)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">Card Number (Simulated)</label>
          <input 
            type="text" 
            placeholder="XXXX XXXX XXXX XXXX" 
            value={cardNumber} 
            onChange={(e) => setCardNumber(e.target.value)} 
            className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Expiry</label>
            <input 
              type="text" 
              placeholder="MM/YY" 
              value={expiry} 
              onChange={(e) => setExpiry(e.target.value)} 
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-semibold mb-1">CVV</label>
            <input 
              type="password" 
              placeholder="***" 
              value={cvv} 
              onChange={(e) => setCvv(e.target.value)} 
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required
            />
          </div>
        </div>
        <div className="flex space-x-3 pt-4">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Proceed to Pay
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
