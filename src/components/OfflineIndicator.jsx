import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const [lastOnline, setLastOnline] = useState(Date.now());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(Date.now());
      toast.success('Connection restored! Welcome back online.');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection. Some features may be limited.');
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connectivity periodically
    const checkConnectivity = async () => {
      try {
        const response = await fetch('/vite.svg', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        if (!isOnline && response.ok) {
          handleOnline();
        }
      } catch (error) {
        if (isOnline) {
          handleOffline();
        }
      }
    };

    const interval = setInterval(checkConnectivity, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/vite.svg', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      if (response.ok) {
        setIsOnline(true);
        setLastOnline(Date.now());
        toast.success('Connection restored!');
      }
    } catch (error) {
      toast.error('Still offline. Please check your internet connection.');
    } finally {
      setIsChecking(false);
    }
  };

  const getOfflineDuration = () => {
    const duration = Date.now() - lastOnline;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (isOnline) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-60 bg-red-500 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 animate-pulse" />
              <div>
                <p className="font-medium">No Internet Connection</p>
                <p className="text-sm opacity-90">
                  Offline for {getOfflineDuration()} • Some features may be limited
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isChecking}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isChecking ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Retry
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineIndicator; 