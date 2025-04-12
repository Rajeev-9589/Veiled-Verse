import { createContext, useContext, useEffect, useState } from 'react';
import { getSubscription } from '../../Backend/firestore/subscription';
import { getCurrentUser } from '../../Backend/firebase/auth/auth'; // Your auth util

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    const user = await getCurrentUser();
    if (user) {
      const subData = await getSubscription(user.uid);
      setSubscription(subData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
