const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Helper to check admin role
async function isAdmin(uid) {
  const userDoc = await db.collection('users').doc(uid).get();
  const roles = userDoc.exists ? userDoc.data().roles || [] : [];
  return roles.includes('admin');
}

// Callable: Get all pending stories (admin only)
exports.getPendingStories = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }
  const uid = context.auth.uid;
  if (!(await isAdmin(uid))) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required.');
  }
  const snapshot = await db.collection('stories').where('status', '==', 'pending').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

// Callable: Set story status (approve/reject) (admin only)
exports.setStoryStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }
  const uid = context.auth.uid;
  if (!(await isAdmin(uid))) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required.');
  }
  const { storyId, status } = data;
  if (!storyId || !['approved', 'rejected'].includes(status)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid storyId or status.');
  }
  await db.collection('stories').doc(storyId).update({
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { success: true };
}); 