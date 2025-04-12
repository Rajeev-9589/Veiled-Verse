import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "../contexts/UserContext";
import { addSubscription } from "../../Backend/firestore/subscription";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_12345"); // Replace with real key in production

const StripePaymentModal = ({ plan, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user } = useUser();
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

      await addSubscription(subscriptionData);
      setLoading(false);
      setShowConfetti(true);

      setTimeout(() => {
        onClose();
        navigate('/explore', {
          state: {
            justSubscribed: true,
            plan: plan.name,
          },
        });
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="relative bg-white bg-opacity-90 backdrop-blur-xl border border-purple-300 rounded-2xl shadow-2xl p-6 w-96 animate-fadeIn scale-100 transition-transform">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Confirm Your Subscription</h2>

        <div className="bg-purple-100 rounded-xl p-4 mb-4 text-center shadow-inner">
          <p className="text-lg font-semibold text-purple-800">Plan: <span className="font-bold">{plan.name}</span></p>
          <p className="text-md text-gray-700">Amount: <span className="font-medium">{plan.price}</span></p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Processing...
            </span>
          ) : (
            "Subscribe Now"
          )}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-gray-600 hover:underline hover:text-gray-800 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default StripePaymentModal;
