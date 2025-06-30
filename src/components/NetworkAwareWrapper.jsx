import React, { useEffect, useState } from 'react';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import OfflineFallback from './OfflineFallback';
import { db } from "../../Backend/firebase/firebase";

const NetworkAwareWrapper = ({ 
  children, 
  showOfflineFallback = true, 
  offlineMessage = null,
  onNetworkChange = null 
}) => {
  const { isOnline, connectionType, connectionSpeed, retryConnection } = useNetworkStatus();
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (onNetworkChange) {
      onNetworkChange({ isOnline, connectionType, connectionSpeed });
    }
  }, [isOnline, connectionType, connectionSpeed, onNetworkChange]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryConnection();
    } finally {
      setIsRetrying(false);
    }
  };

  // If offline and fallback is enabled, show offline page
  if (!isOnline && showOfflineFallback) {
    return <OfflineFallback onRetry={handleRetry} isRetrying={isRetrying} />;
  }

  // If offline and custom message is provided, show custom message
  if (!isOnline && offlineMessage) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-yellow-800">{offlineMessage}</span>
        </div>
      </div>
    );
  }

  // If online, render children normally
  return children;
};

export default NetworkAwareWrapper; 