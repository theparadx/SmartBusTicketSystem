import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

interface AutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const Autocomplete = ({ label, value, onChange, placeholder }: AutocompleteProps) => {
  const [options, setOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stations, setStations] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch stations once
    api.get('/routes').then(res => setStations(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (val.length > 0) {
      const filtered = stations.filter(s => s.toLowerCase().includes(val.toLowerCase()));
      setOptions(filtered);
      setShowOptions(true);
      setError(filtered.length === 0 ? 'Invalid station' : null);
    } else {
      setShowOptions(false);
      setError(null);
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setShowOptions(false);
    setError(null);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-gray-700 text-sm font-semibold mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (value && options.length > 0) setShowOptions(true);
        }}
        placeholder={placeholder}
        className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
      {showOptions && options.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 transition-colors"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
