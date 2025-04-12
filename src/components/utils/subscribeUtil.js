// utils/subscribeUtils.js
import { addSubscription } from "../../../Backend/firestore/subscription";

export const subscribeToTier = async (userId, tier) => {
  if (!userId || !tier) return;

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 30); // Valid for 30 days

  const subscriptionData = {
    userId,
    tier,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isActive: true,
  };

  const success = await addSubscription(subscriptionData);
  return success;
};
