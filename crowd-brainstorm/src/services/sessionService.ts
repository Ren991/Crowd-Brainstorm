import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '@/app/firebase';
import { generateCode } from './utils'; // función anterior

export type SessionCreatePayload = {
  title: string;
  description?: string;
  createdBy: string;
  createdByEmail?: string;
  isAnonymous?: boolean;
  maxParticipants?: number;
  settings?: Record<string, any>;
  displayName: string;
};

const sessionsRef = collection(db, 'sessions');

export const createSession = async (payload: SessionCreatePayload) => {
  if (!payload.title || !payload.displayName) {
    throw new Error('El título de la sesión y tu nombre son obligatorios');
  }

  const code = generateCode();

  const data = {
    ...payload,
    code,
    isActive: true,
    createdAt: serverTimestamp(),
    participantsCount: 1,
    participants: {
      [payload.createdBy]: {
        joinedAt: serverTimestamp(),
        displayName: payload.displayName
      }
    },
    phase: 'submission',
  };

  const docRef = await addDoc(sessionsRef, data);
  return { id: docRef.id, code };
};

export const getSessionByCode = async (code: string) => {
  const q = query(sessionsRef, where('code', '==', code));
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
};

export const listSessionsByUser = (uid: string, onUpdate: (sessions: any[]) => void) => {
  const q = query(sessionsRef, where('createdBy', '==', uid));
  return onSnapshot(q, (snap) => {
    const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    onUpdate(arr);
  });
};

// unirse de forma segura concurrente: runTransaction para incrementar participantsCount y agregar a mapa
export const joinSessionById = async (sessionId: string, uid: string, displayName?: string) => {
  const ref = doc(db, 'sessions', sessionId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('Session no existe');
    const data = snap.data() as any;
    if (!data.isActive) throw new Error('Sesión no activa');
    if (data.maxParticipants && data.participantsCount >= data.maxParticipants) throw new Error('Sesión llena');

    const participants = data.participants || {};
    if (participants[uid]) {
      // ya está unido
      return { alreadyJoined: true };
    }

    participants[uid] = { joinedAt: serverTimestamp(), displayName: displayName || null };

    tx.update(ref, {
      participants,
      participantsCount: (data.participantsCount || 0) + 1
    });

    return { alreadyJoined: false };
  });
};
export const getSessionById = async (id: string) => {
  const docRef = doc(db, 'sessions', id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
};

export const deleteSessionById = async (sessionId: string) => {
  const ref = doc(db, 'sessions', sessionId);
  await deleteDoc(ref);
};