import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StripePaymentModal from '@/components/StripePaymentModal';
import { useUser } from '@/contexts/UserContext';
import { addSubscription } from '../../Backend/firestore/subscription';
import { format } from 'date-fns';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    features: ['Access free stories', 'Basic support'],
    plan: 'free',
  },
  {
    name: 'Premium',
    price: '₹99/month',
    features: ['Access premium stories', 'Comment & interact', 'No ads'],
    plan: 'premium',
  },
  {
    name: 'Gold',
    price: '₹199/month',
    features: ['All Premium features', 'Early access to stories', 'Direct chat with writers'],
    plan: 'gold',
  },
];

const Subscription = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const { user, userData, setUserData } = useUser();

  const currentTier = userData?.subscription?.tier || "free";

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (plan.plan === currentTier) return;

    // Simulate Stripe Payment for now — add backend logic
    const startDate = new Date();
    const endDate = plan.plan === "free" ? null : new Date(startDate.setMonth(startDate.getMonth() + 1));
    
    const subscriptionData = {
      userId: user.uid,
      tier: plan.plan,
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
      isActive: true,
    };

    const success = await addSubscription(subscriptionData);
    if (success) {
      setUserData({
        ...userData,
        subscription: {
          tier: plan.plan,
          startDate: subscriptionData.startDate,
          endDate: subscriptionData.endDate,
          isActive: true,
        },
      });

      alert(`Successfully subscribed to ${plan.name} plan!`);
    } else {
      alert("Subscription failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Choose a Subscription Plan</h1>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, idx) => {
          const isCurrentPlan = plan.plan === currentTier;

          return (
            <div
              key={idx}
              className={`bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-between border-2 transition ${
                isCurrentPlan ? "border-purple-500 bg-purple-50" : "border-transparent hover:border-purple-400"
              }`}
            >
              <div>
                <h2 className="text-2xl font-semibold text-purple-600">{plan.name}</h2>
                <p className="text-xl mt-2 mb-4">{plan.price}</p>
                <ul className="space-y-2 text-gray-700">
                  {plan.features.map((feat, i) => (
                    <li key={i}>• {feat}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full px-4 py-2 rounded-lg transition font-semibold ${
                    isCurrentPlan
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Already Subscribed" : "Subscribe"}
                </button>
                {isCurrentPlan && (
                  <p className="mt-2 text-sm text-purple-600 font-medium">
                    🎉 You're already enjoying this plan!
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedPlan && (
        <StripePaymentModal
          plan={selectedPlan}
          onClose={() => {
            setSelectedPlan(null);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Subscription;
