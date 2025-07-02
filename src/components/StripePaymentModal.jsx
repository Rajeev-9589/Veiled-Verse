import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useEnhancedAuth } from "../contexts/EnhancedAuthContext";
import { addSubscription } from "../../Backend/firestore/subscription";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentModal = ({ plan, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user } = useEnhancedAuth();
  const navigate = useNavigate();

  if (!plan) return null;

  const handlePayment = async () => {
    setLoading(true);

    setTimeout(async () => {
      const subscriptionData = {
        userId: user.uid,
        plan: plan.name,
        price: plan.price,
        status: "active",
        startDate: new Date(),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      if (onSuccess) {
        await onSuccess(subscriptionData);
      } else {
        await addSubscription(subscriptionData);
      }

      setLoading(false);
      setShowConfetti(true);

      setTimeout(() => {
        onClose();
        navigate("/dashboard", {
          state: {
            justSubscribed: true,
            plan: plan.name,
          },
        });
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {showConfetti && <Confetti />}

      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Subscription
          </h2>

          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-900">{plan.name} Plan</h3>
            <p className="text-2xl font-bold text-purple-600">{plan.price}</p>
            <p className="text-sm text-purple-700">per month</p>
          </div>

          <div className="space-y-3 mb-6 text-left">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            You can cancel your subscription at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
