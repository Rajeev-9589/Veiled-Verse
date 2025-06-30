import React from 'react';
import { motion } from 'framer-motion';
import { 
  WifiOff, 
  BookOpen, 
  FileText, 
  RefreshCw, 
  Wifi, 
  AlertTriangle,
  Clock,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const OfflineFallback = ({ onRetry, isRetrying }) => {
  const offlineFeatures = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Read Saved Stories",
      description: "Access stories you've previously downloaded or cached"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Draft Stories",
      description: "Continue writing your stories offline - they'll sync when you're back online"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Recent Activity",
      description: "View your recent reading and writing activity"
    }
  ];

  const troubleshootingSteps = [
    "Check your Wi-Fi connection",
    "Try switching to mobile data",
    "Restart your router",
    "Check if other websites work",
    "Try refreshing the page"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4"
          >
            <WifiOff className="w-10 h-10 text-red-600" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You're Offline
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't worry! You can still access some features while offline. 
            Your work will be saved and synced when you're back online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Available Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-green-600" />
                Available Offline
              </CardTitle>
              <CardDescription>
                Features you can still use without internet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {offlineFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200"
                >
                  <div className="text-green-600 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">{feature.title}</h4>
                    <p className="text-sm text-green-700">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Troubleshooting
              </CardTitle>
              <CardDescription>
                Steps to get back online
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {troubleshootingSteps.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </motion.li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Checking Connection...
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.reload()}
            className="px-8"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        </div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">
              No internet connection detected
            </span>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
              <p className="text-sm text-blue-700">
                Enable offline mode in your browser settings to access more content when you're offline. 
                Your stories and drafts are automatically saved locally.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OfflineFallback; 