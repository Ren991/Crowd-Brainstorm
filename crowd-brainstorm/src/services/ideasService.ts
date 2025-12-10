import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/app/firebase';

export const listenIdeas = (sessionId: string, cb: (ideas: any[]) => void) => {
  const ref = collection(db, 'sessions', sessionId, 'ideas');
  const q = query(ref, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snap) => {
    const ideas = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    cb(ideas);
  });
};

export const createIdea = async (
  sessionId: string,
  text: string,
  uid: string,
  authorName: string,
  isAnonymous: boolean
) => {
  const ref = collection(db, 'sessions', sessionId, 'ideas');

  await addDoc(ref, {
    text,
    createdBy: uid,
    authorName,
    isAnonymous,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateIdea = async (
  sessionId: string,
  ideaId: string,
  text: string
) => {
  const ref = doc(db, 'sessions', sessionId, 'ideas', ideaId);
  await updateDoc(ref, {
    text,
    updatedAt: serverTimestamp()
  });
};

export const deleteIdea = async (
  sessionId: string,
  ideaId: string
) => {
  const ref = doc(db, 'sessions', sessionId, 'ideas', ideaId);
  await deleteDoc(ref);
};
