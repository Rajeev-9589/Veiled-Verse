import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { auth, db } from "../../Backend/firebase/auth/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "sonner";

const EnhancedAuthContext = createContext();

export const EnhancedAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simplified user data fetching
  const fetchUserData = useCallback(async (firebaseUser) => {
    try {
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { uid: firebaseUser.uid, ...docSnap.data() };
        setUserData(data);
        return data;
      } else {
        // Create user profile if doesn't exist
        const newUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "Anonymous Writer",
          roles: ["reader"],
          createdAt: serverTimestamp(),
          lastSeen: serverTimestamp(),
          preferences: {
            theme: "light",
            notifications: true,
            autoSave: true,
          },
          stats: {
            storiesWritten: 0,
            storiesRead: 0,
            totalEarnings: 0,
            followers: 0,
            following: 0,
          },
        };

        await setDoc(docRef, newUserData);
        setUserData(newUserData);
        return newUserData;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }, []);

  // Simplified logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  }, []);

  // Update user data
  const updateUserData = useCallback(
    async (updates) => {
      if (!userData?.uid) return;

      try {
        const userRef = doc(db, "users", userData.uid);
        await updateDoc(userRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });

        setUserData((prev) => ({ ...prev, ...updates }));
        toast.success("Profile updated successfully");
      } catch (error) {
        console.error("Error updating user data:", error);
        toast.error("Failed to update profile");
      }
    },
    [userData],
  );

  // Check permissions
  const hasPermission = useCallback(
    (permission) => {
      if (!userData?.roles) return false;

      const permissionMap = {
        write: ["writer", "admin"],
        publish: ["writer", "admin"],
        moderate: ["moderator", "admin"],
        admin: ["admin"],
        read_premium: ["reader", "writer", "moderator", "admin"],
        earn_money: ["writer", "admin"],
      };

      const requiredRoles = permissionMap[permission] || [];
      return userData.roles.some((role) => requiredRoles.includes(role));
    },
    [userData],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        await fetchUserData(firebaseUser);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  // Simplified activity tracking - only update on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (userData?.uid && !document.hidden) {
        const userRef = doc(db, "users", userData.uid);
        updateDoc(userRef, {
          lastSeen: serverTimestamp(),
        }).catch(console.error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userData]);

  const value = {
    user,
    userData,
    loading,
    logout,
    updateUserData,
    hasPermission,
  };

  return (
    <EnhancedAuthContext.Provider value={value}>
      {children}
    </EnhancedAuthContext.Provider>
  );
};

export const useEnhancedAuth = () => {
  const context = useContext(EnhancedAuthContext);
  if (!context) {
    throw new Error("useEnhancedAuth must be used within EnhancedAuthProvider");
  }
  return context;
};
