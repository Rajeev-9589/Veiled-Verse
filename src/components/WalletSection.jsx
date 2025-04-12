// components/Wallet.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const Wallet = () => {
  const [isOpen, setIsOpen] = useState(false);

  const earnings = {
    total: 1520,
    freeReads: 300,
    paidReads: 950,
    bonuses: 270,
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="absolute top-0 right-6 bg-white shadow-md border rounded-xl p-4 w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Wallet</h3>
        <button onClick={toggleDropdown}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <div className="text-xl font-bold text-purple-600 mb-1">₹{earnings.total}</div>
      <p className="text-xs text-gray-500 mb-2">Total Earnings</p>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="text-sm text-gray-700 space-y-1">
              <p>📘 Free Reads: ₹{earnings.freeReads}</p>
              <p>💰 Paid Reads: ₹{earnings.paidReads}</p>
              <p>🎁 Bonuses: ₹{earnings.bonuses}</p>
            </div>
            <Button className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white">
              Withdraw
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
