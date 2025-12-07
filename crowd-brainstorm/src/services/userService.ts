import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import type { IUser } from '@/interfaces/User';

export const saveUserToFirestore = async (user: IUser) => {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, user);
};

export const getUserFromFirestore = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
};
