import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReaderDashboard from "@/components/ReaderDashboard";
import WriterDashboard from "@/components/WriterDashboard";
import WalletSection from "@/components/WalletSection";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Dashboard = () => {
  const { userData, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const [view, setView] = useState("reader");

  const tier = subscription?.tier;

  useEffect(() => {
    if (userData?.roles?.includes("writer")) {
      setView("writer");
    } else {
      setView("reader");
    }
  }, [userData]);

  if (authLoading || subLoading) return <div className="text-center">Loading...</div>;
  if (!userData) return <div className="text-center">Please log in.</div>;

  const { name, roles, uid } = userData;
  const hasReader = roles.includes("reader");
  const hasWriter = roles.includes("writer");

  const toggleView = () => {
    setView((prev) => (prev === "writer" ? "reader" : "writer"));
  };

  return (
    <div className="min-h-screen pt-5 px-4 bg-gray-50 relative">
      {tier !== "gold" && (
        <div className="bg-gradient-to-r from-blue-100 to-purple-200 text-black p-3 rounded-lg text-sm mb-4">
          You're on <strong>{tier}</strong> plan. Unlock full analytics and earnings with
          <a href="/subscribe" className="ml-1 text-purple-600 underline">Gold Tier</a>.
        </div>
      )}

      {hasWriter && view === "writer" && (
        <div className="absolute top-[6.5rem] md:top-[5rem] right-4">
          <WalletSection userId={uid} />
        </div>
      )}

      <div className="flex justify-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {name}</h2>
      </div>

      {hasReader && hasWriter && (
        <div className="flex justify-center mb-6">
          <Button onClick={toggleView}>
            Switch to {view === "writer" ? "Reader" : "Writer"} Dashboard
          </Button>
        </div>
      )}

      {view === "reader" && hasReader && <ReaderDashboard />}
      {view === "writer" && hasWriter && <WriterDashboard />}
    </div>
  );
};

export default Dashboard;
