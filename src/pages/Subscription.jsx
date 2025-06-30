import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StripePaymentModal from "@/components/StripePaymentModal";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { addSubscription } from "../../Backend/firestore/subscription";
import { format } from "date-fns";

const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["Access free stories", "Basic support"],
    plan: "free",
  },
  {
    name: "Premium",
    price: "₹99/month",
    features: ["Access premium stories", "Comment & interact", "No ads"],
    plan: "premium",
  },
  {
    name: "Gold",
    price: "₹199/month",
    features: [
      "All Premium features",
      "Early access to stories",
      "Direct chat with writers",
    ],
    plan: "gold",
  },
];

const Subscription = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const { user, userData, updateUserData } = useEnhancedAuth();

  const currentTier = userData?.subscription?.tier || "free";

  const handlePlanSelect = (plan) => {
    if (!user) {
      alert("Please log in to subscribe");
      navigate("/login");
      return;
    }

    if (plan.plan === "free") {
      // Handle free plan upgrade
      updateUserData({
        subscription: {
          tier: "free",
          startDate: new Date(),
          status: "active",
        },
      });
      navigate("/dashboard");
      return;
    }

    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handlePaymentSuccess = async (subscriptionData) => {
    try {
      await addSubscription({
        ...subscriptionData,
        userId: user.uid,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        status: "active",
        startDate: new Date(),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      updateUserData({
        subscription: {
          tier: selectedPlan.plan,
          startDate: new Date(),
          status: "active",
        },
      });

      setModalOpen(false);
      navigate("/dashboard", {
        state: {
          justSubscribed: true,
          plan: selectedPlan.name,
        },
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Failed to update subscription");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 pt-20">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock premium features and support your favorite writers with our
            subscription plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.plan}
              className={`relative bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                currentTier === plan.plan ? "ring-2 ring-purple-500" : ""
              }`}
            >
              {currentTier === plan.plan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-purple-600 mb-6">
                  {plan.price}
                  {plan.plan !== "free" && (
                    <span className="text-lg text-gray-500">/month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    currentTier === plan.plan
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : plan.plan === "free"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-purple-500 hover:bg-purple-600 text-white"
                  }`}
                  disabled={currentTier === plan.plan}
                >
                  {currentTier === plan.plan
                    ? "Current Plan"
                    : plan.plan === "free"
                      ? "Get Started"
                      : "Subscribe Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <StripePaymentModal
            plan={selectedPlan}
            onClose={() => setModalOpen(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Subscription;
