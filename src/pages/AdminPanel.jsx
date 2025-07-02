import React, { useEffect, useState } from 'react';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { toast } from 'sonner';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../../Backend/firebase/auth/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminPanel = () => {
  const { hasPermission } = useEnhancedAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewStory, setReviewStory] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    if (!hasPermission('admin')) return;
    const fetchAllStories = async () => {
      setLoading(true);
      try {
        const q = collection(db, 'stories');
        const querySnapshot = await getDocs(q);
        setStories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        toast.error('Failed to fetch stories for review');
      } finally {
        setLoading(false);
      }
    };
    fetchAllStories();
  }, [hasPermission, db]);

  const handleStatus = async (storyId, status) => {
    setActionLoading(storyId + status);
    try {
      const storyRef = doc(db, 'stories', storyId);
      await updateDoc(storyRef, { status });
      setStories((prev) => prev.map((s) => s.id === storyId ? { ...s, status } : s));
      toast.success(`Story ${status}`);
    } catch (err) {
      toast.error('Failed to update story status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (storyId) => {
    setActionLoading(storyId + 'remove');
    try {
      const storyRef = doc(db, 'stories', storyId);
      await deleteDoc(storyRef);
      setStories((prev) => prev.filter((s) => s.id !== storyId));
      toast.success('Story removed');
    } catch (err) {
      toast.error('Failed to remove story');
    } finally {
      setActionLoading(null);
    }
  };

  if (!hasPermission('admin')) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-red-600">Access Denied</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - All Stories</h1>
      {loading ? (
        <div>Loading...</div>
      ) : stories.length === 0 ? (
        <div>No stories found.</div>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{story.title}</h2>
                <p className="text-gray-600">By: {story.authorName || story.authorId}</p>
                <p className="mt-2 text-gray-800 max-w-2xl">{story.summary || (story.content ? story.content.slice(0, 200) + '...' : '')}</p>
                <p className="mt-2 text-sm">
                  <span className={`font-bold ${story.status === 'approved' ? 'text-green-600' : story.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                  </span>
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                {story.status === 'approved' ? (
                  <button
                    onClick={() => handleRemove(story.id)}
                    className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${actionLoading === story.id + 'remove' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={actionLoading === story.id + 'remove'}
                  >
                    {actionLoading === story.id + 'remove' ? 'Removing...' : 'Remove'}
                  </button>
                ) : story.status === 'rejected' ? (
                  <button
                    onClick={() => handleRemove(story.id)}
                    className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${actionLoading === story.id + 'remove' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={actionLoading === story.id + 'remove'}
                  >
                    {actionLoading === story.id + 'remove' ? 'Removing...' : 'Remove'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleStatus(story.id, 'approved')}
                      className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${actionLoading === story.id + 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={actionLoading === story.id + 'approved'}
                    >
                      {actionLoading === story.id + 'approved' ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleStatus(story.id, 'rejected')}
                      className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${actionLoading === story.id + 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={actionLoading === story.id + 'rejected'}
                    >
                      {actionLoading === story.id + 'rejected' ? 'Rejecting...' : 'Reject'}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setReviewStory(story)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={!!reviewStory} onOpenChange={() => setReviewStory(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="border-b px-6 pt-6 pb-3 flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Review Story</DialogTitle>
            <button
              onClick={() => setReviewStory(null)}
              className="ml-auto text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
          </DialogHeader>
          {reviewStory && (
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-1 text-purple-700">{reviewStory.title}</h2>
                <p className="text-gray-500 mb-2 text-sm">By: <span className="font-semibold">{reviewStory.authorName || reviewStory.authorId}</span></p>
                <p className="text-gray-700 mb-4 italic">{reviewStory.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-pink-600">Story Content</h3>
                <div className="prose prose-p:my-2 prose-h1:my-2 prose-h2:my-2 prose-h3:my-2 max-w-none bg-gray-50 rounded-lg p-4 shadow-inner border overflow-x-auto" style={{ minHeight: 120 }} dangerouslySetInnerHTML={{ __html: reviewStory.content }} />
              </div>
              {reviewStory.status !== 'approved' && (
                <button
                  onClick={async () => {
                    await handleStatus(reviewStory.id, 'approved');
                    setReviewStory(null);
                  }}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
                >
                  Approve
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel; 