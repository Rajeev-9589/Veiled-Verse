import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog } from "@headlessui/react";
import { toast } from 'sonner';

const BuyModal = ({ open, onClose, story, onBuy }) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex items-center justify-center"
          open={open} // ✅ THIS LINE IS IMPORTANT
          onClose={onClose}
        >

          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="z-50 bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative"
          >
            <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">
              Confirm Purchase
            </Dialog.Title>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to buy <span className="font-semibold">{story.title}</span> for ₹{story.price}?
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onBuy(story);
                  toast.success(`You purchased "${story.title}" successfully!`);
                  onClose();
                }}
              >
                Buy Now
              </Button>


            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default BuyModal;
