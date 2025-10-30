import { useEffect, useState } from 'react';

export type ConnectionQuality = 'fast' | 'medium' | 'slow' | 'offline';

interface ConnectionInfo {
  quality: ConnectionQuality;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export function useConnectionQuality(): ConnectionInfo {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    quality: 'fast',
  });

  useEffect(() => {
    // Check if Network Information API is available
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    const updateConnectionInfo = () => {
      if (!connection) {
        // Fallback: detect online/offline
        setConnectionInfo({
          quality: navigator.onLine ? 'fast' : 'offline',
        });
        return;
      }

      const effectiveType = connection.effectiveType;
      const downlink = connection.downlink;
      const rtt = connection.rtt;
      const saveData = connection.saveData;

      let quality: ConnectionQuality = 'fast';

      if (!navigator.onLine) {
        quality = 'offline';
      } else if (effectiveType === 'slow-2g' || effectiveType === '2g' || rtt > 2000) {
        quality = 'slow';
      } else if (effectiveType === '3g' || rtt > 1000 || downlink < 1.5) {
        quality = 'medium';
      } else {
        quality = 'fast';
      }

      setConnectionInfo({
        quality,
        effectiveType,
        downlink,
        rtt,
        saveData,
      });
    };

    updateConnectionInfo();

    // Listen for connection changes
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
    }

    window.addEventListener('online', updateConnectionInfo);
    window.addEventListener('offline', updateConnectionInfo);

    return () => {
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
      window.removeEventListener('online', updateConnectionInfo);
      window.removeEventListener('offline', updateConnectionInfo);
    };
  }, []);

  return connectionInfo;
}
