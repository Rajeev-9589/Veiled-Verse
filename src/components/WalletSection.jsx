// components/Wallet.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Wallet,
  TrendingUp,
  DollarSign,
  Gift,
} from "lucide-react";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../Backend/firebase/auth/auth";

const WalletSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [earnings, setEarnings] = useState({
    total: 0,
    freeReads: 0,
    paidReads: 0,
    bonuses: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useEnhancedAuth();

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch user's wallet data
        const walletRef = doc(db, "wallets", user.uid);
        const walletDoc = await getDoc(walletRef);

        if (walletDoc.exists()) {
          const walletData = walletDoc.data();
          setEarnings({
            total: walletData.totalEarnings || 0,
            freeReads: walletData.freeReadEarnings || 0,
            paidReads: walletData.paidReadEarnings || 0,
            bonuses: walletData.bonusEarnings || 0,
          });
        } else {
          // Initialize wallet if it doesn't exist
          setEarnings({
            total: 0,
            freeReads: 0,
            paidReads: 0,
            bonuses: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setEarnings({
          total: 0,
          freeReads: 0,
          paidReads: 0,
          bonuses: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [user]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleWithdraw = async () => {
    // TODO: Implement withdrawal logic
    console.log("Withdrawal requested for:", earnings.total);
    // This would typically open a withdrawal modal or redirect to payment processor
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Wallet</h3>
            <p className="text-sm text-gray-500">Loading earnings...</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Wallet</h3>
          <p className="text-sm text-gray-500">Your earnings</p>
        </div>
      </div>

      {/* Total Earnings Display */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
              ₹{earnings.total.toLocaleString()}
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={toggleDropdown}
        className="w-full bg-white/50 border-gray-200 hover:bg-white/80 transition-all duration-300 mb-4"
      >
        {isOpen ? (
          <>
            <ChevronUp className="w-4 h-4 mr-2" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-2" />
            View Details
          </>
        )}
      </Button>

      {/* Detailed Breakdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden space-y-3"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📘</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Free Reads
                  </span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  ₹{earnings.freeReads.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Paid Reads
                  </span>
                </div>
                <span className="text-sm font-semibold text-purple-600">
                  ₹{earnings.paidReads.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Gift className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Bonuses
                  </span>
                </div>
                <span className="text-sm font-semibold text-orange-600">
                  ₹{earnings.bonuses.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Withdraw Button */}
            <Button
              onClick={handleWithdraw}
              disabled={earnings.total === 0}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              {earnings.total === 0 ? "No Earnings Yet" : "Withdraw Earnings"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletSection;
