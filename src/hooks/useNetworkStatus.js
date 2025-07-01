import { useState, useEffect, useCallback } from 'react';

// Use a public endpoint for reliable connectivity check
const CONNECTIVITY_URL = 'https://www.gstatic.com/generate_204';

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [connectionSpeed, setConnectionSpeed] = useState('unknown');

  const checkConnectionType = useCallback(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      setConnectionType(connection.effectiveType || 'unknown');
      setConnectionSpeed(connection.downlink ? `${connection.downlink} Mbps` : 'unknown');
    }
  }, []);

  // Robust connectivity check using a public endpoint
  const checkConnectivity = useCallback(async () => {
    try {
      const startTime = Date.now();
      const response = await fetch(CONNECTIVITY_URL, {
        method: 'GET',
        cache: 'no-cache',
        mode: 'no-cors', // allow fetch to succeed even if opaque
      });
      const endTime = Date.now();
      const latency = endTime - startTime;
      // If fetch does not throw, assume online
      return { isOnline: true, latency };
    } catch (error) {
      return { isOnline: false, latency: null };
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkConnectionType();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleConnectionChange = () => {
      checkConnectionType();
    };

    // Initial check
    checkConnectionType();

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    // Periodic connectivity check
    const interval = setInterval(async () => {
      const { isOnline: onlineStatus } = await checkConnectivity();
      if (onlineStatus !== isOnline) {
        setIsOnline(onlineStatus);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
      clearInterval(interval);
    };
  }, [isOnline, checkConnectionType, checkConnectivity]);

  // Force a connectivity check on retry
  const retryConnection = useCallback(async () => {
    const { isOnline: onlineStatus, latency } = await checkConnectivity();
    setIsOnline(onlineStatus); // Always update state
    return { isOnline: onlineStatus, latency };
  }, [checkConnectivity]);

  return {
    isOnline,
    connectionType,
    connectionSpeed,
    retryConnection,
    checkConnectivity
  };
};

export default useNetworkStatus; 