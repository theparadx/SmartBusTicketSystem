import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../utils/api';

// Global variable to keep track of the camera teardown process across remounts
let globalClearPromise: Promise<void> | null = null;

export const QRScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeScanner = async () => {
      // Wait for any previous scanner instance to completely clear
      if (globalClearPromise) {
        await globalClearPromise.catch(() => {});
      }
      
      if (!isMounted) return;

      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    };

    initializeScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        const promise = scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
        globalClearPromise = promise;
      }
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (loading) return;
    setLoading(true);
    
    // Pause scanning
    scannerRef.current?.pause(true);

    try {
      const res = await api.post('/conductor/scan', { qrToken: decodedText });
      setScanResult(res.data.message);
    } catch (error: any) {
      setScanResult(error.response?.data?.message || 'Validation failed');
    } finally {
      setLoading(false);
      // Resume scanning after 3 seconds
      setTimeout(() => {
        setScanResult(null);
        scannerRef.current?.resume();
      }, 3000);
    }
  };

  const onScanFailure = (error: any) => {
    // silently ignore errors to prevent console spam
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
      <h3 className="text-xl font-bold mb-4">Scan QR Ticket</h3>
      <div id="reader" className="mx-auto overflow-hidden"></div>
      
      {scanResult && (
        <div className={`mt-4 p-4 rounded-md font-bold text-lg ${
          scanResult.includes('IN USE') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {scanResult}
        </div>
      )}
    </div>
  );
};
