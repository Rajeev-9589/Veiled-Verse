// WriterDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../Backend/firebase/auth/auth"; // adjust if needed

const dummyStats = [
  { name: "Jan", earnings: 150 },
  { name: "Feb", earnings: 210 },
  { name: "Mar", earnings: 180 },
  { name: "Apr", earnings: 260 },
  { name: "May", earnings: 190 },
];

const WriterDashboard = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "stories"),
          where("authorId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const storyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStories(storyData);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Writer Dashboard</h1>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm border">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Stories</div>
            <div className="text-xl font-bold text-gray-800">{stories.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Likes</div>
            <div className="text-xl font-bold text-gray-800">830</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Comments</div>
            <div className="text-xl font-bold text-gray-800">121</div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="shadow-sm border">
        <CardContent className="p-4">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Earnings Overview</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummyStats}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderColor: "#e5e7eb", borderRadius: 8 }}
                  cursor={{ fill: "rgba(147, 51, 234, 0.1)" }}
                />
                <Bar dataKey="earnings" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Story List */}
      <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Your Stories</h2>
      {loading ? (
        <p className="text-gray-500">Loading your stories...</p>
      ) : stories.length === 0 ? (
        <p className="text-gray-500">You haven't published any stories yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <Card key={story.id} className="shadow-sm border hover:shadow-md transition">
              <CardContent className="p-4 space-y-1">
                <div className="text-lg font-semibold text-purple-700 truncate">{story.title}</div>
                <div className="text-sm text-gray-600">{story.genre}</div>
                <div className="text-sm text-gray-500">
                  {story.isPaid ? `₹${story.price}` : "Free"} • {new Date(story.createdAt?.seconds * 1000).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WriterDashboard;