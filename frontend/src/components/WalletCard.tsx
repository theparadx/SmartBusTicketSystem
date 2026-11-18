import { useState, useEffect } from 'react';
import api from '../utils/api';

export const WalletCard = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  
  const fetchBalance = async () => {
    try {
      const res = await api.get('/wallet/balance');
      setBalance(res.data.balance);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleDeposit = async () => {
    try {
      await api.post('/wallet/deposit', { amount: parseFloat(amount) });
      setAmount('');
      fetchBalance();
    } catch (error) {
      alert('Failed to deposit');
    }
  };

  const handleWithdraw = async () => {
    try {
      await api.post('/wallet/withdraw', { amount: parseFloat(amount) });
      setAmount('');
      fetchBalance();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to withdraw');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">Wallet</h3>
      <div className="text-3xl font-bold text-blue-600 mb-6">₹{balance.toFixed(2)}</div>
      
      <div className="flex space-x-2">
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="Amount" 
          className="border px-3 py-2 rounded-md flex-1"
        />
        <button onClick={handleDeposit} className="bg-green-600 text-white px-4 py-2 rounded-md">Deposit</button>
        <button onClick={handleWithdraw} className="bg-red-600 text-white px-4 py-2 rounded-md">Withdraw</button>
      </div>
    </div>
  );
};
