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

type CreateSessionInput = {
  title: string;
  description?: string;
  createdBy: string;
  createdByEmail: string;
  displayName: string;
  isAnonymous: boolean;
  maxParticipants: number;
};

const sessionsRef = collection(db, 'sessions');

export type CreateSessionResult = {
  id: string;
  code: string;
};

export const createSession = async (
  data: CreateSessionInput
): Promise<CreateSessionResult> => {
  // 🔐 Código corto para ingresar a la sesión
  const code = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  // 1️⃣ Crear sesión
  const sessionRef = await addDoc(collection(db, "sessions"), {
    title: data.title,
    description: data.description || "",
    createdBy: data.createdBy,
    createdByEmail: data.createdByEmail,
    isAnonymous: data.isAnonymous,
    maxParticipants: data.maxParticipants,
    code,

    phase: "submission",
    isActive: true,

    participants: {
      [data.createdBy]: {
        displayName: data.displayName,
        joinedAt: serverTimestamp()
      }
    },
    participantsCount: 1,

    createdAt: serverTimestamp()
  });

  // 2️⃣ Crear workflow inicial
  const workflowRef = await addDoc(
    collection(db, "sessions", sessionRef.id, "workflows"),
    {
      title: data.description || data.title, // 👈 primer workflow usa la descripción/título
      phase: "submission",
      index: 1,
      createdAt: serverTimestamp()
    }
  );

  // 3️⃣ Setear workflow activo
  await updateDoc(doc(db, "sessions", sessionRef.id), {
    activeWorkflowId: workflowRef.id
  });

  return {
    id: sessionRef.id,
    code
  };
};
/* export const createSession = async (data: {
  title: string;
  description: string;
  createdBy: string;
  createdByEmail: string;
  displayName: string;
  isAnonymous: boolean;
  maxParticipants: number;
}) : Promise<{ id: string; code: string }> => {
  const sessionRef = await addDoc(collection(db, "sessions"), {
    ...data,
    createdAt: serverTimestamp(),
    participantsCount: 1,
    phase: "submission",
  });

  // 👇 Workflow inicial
  const workflowRef = await addDoc(
    collection(db, "sessions", sessionRef.id, "workflows"),
    {
      title: data.description, // 👈 acá está la clave
      phase: "submission",
      createdAt: serverTimestamp(),
    }
  );

  // 👇 setear activo
  await updateDoc(sessionRef, {
    activeWorkflowId: workflowRef.id,
  });

  return { id: sessionRef.id };
};
 */

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

export const updateSessionPhase = async (
  sessionId: string,
  phase: "IDEAS" | "VOTING" | "RESULTS",
  durationSeconds?: number
) => {
  const ref = doc(db, "sessions", sessionId);

  if (phase === "RESULTS") {
    await updateDoc(ref, { phase });
    return;
  }

  await updateDoc(ref, {
    phase,
    timer: {
      startAt: serverTimestamp(),
      duration: durationSeconds ?? 0
    }
  });
};


export const listenSessionById = (
  sessionId: string,
  onUpdate: (session: any) => void
) => {
  const ref = doc(db, "sessions", sessionId);

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;
    onUpdate({ id: snap.id, ...snap.data() });
  });
};
export const createWorkflow = async (sessionId: string) => {
  const workflowsRef = collection(
    db,
    "sessions",
    sessionId,
    "workflows"
  );

  const workflowDoc = await addDoc(workflowsRef, {
    phase: "IDEAS",
    createdAt: serverTimestamp(),
    timer: null
  });

  // activar este workflow
  await updateDoc(doc(db, "sessions", sessionId), {
    activeWorkflowId: workflowDoc.id
  });

  return workflowDoc.id;
};