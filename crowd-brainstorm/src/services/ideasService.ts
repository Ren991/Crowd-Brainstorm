import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteField,
  increment
} from "firebase/firestore";
import { db } from "@/app/firebase";

/* =====================================
   LISTEN IDEAS (REALTIME)
===================================== */
export const listenIdeas = (
  sessionId: string,
  workflowId: string,
  cb: (ideas: any[]) => void
) => {
  const ref = collection(
    db,
    "sessions",
    sessionId,
    "workflows",
    workflowId,
    "ideas"
  );

  const q = query(
    ref,
    orderBy("votesCount", "desc"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, snap => {
    const ideas = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    cb(ideas);
  });
};

/* =====================================
   CREATE IDEA
===================================== */
export const createIdea = async (
  sessionId: string,
  workflowId: string,
  text: string,
  uid: string,
  authorName: string,
  isAnonymous: boolean
) => {
  const ref = collection(
    db,
    "sessions",
    sessionId,
    "workflows",
    workflowId,
    "ideas"
  );

  await addDoc(ref, {
    text,
    uid,
    author: isAnonymous ? "Anónimo" : authorName,
    isAnonymous,
    votes: {},
    votesCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

/* =====================================
   UPDATE IDEA
===================================== */
export const updateIdea = async (
  sessionId: string,
  workflowId: string,
  ideaId: string,
  text: string
) => {
  const ref = doc(
    db,
    "sessions",
    sessionId,
    "workflows",
    workflowId,
    "ideas",
    ideaId
  );

  await updateDoc(ref, {
    text,
    updatedAt: serverTimestamp()
  });
};

/* =====================================
   DELETE IDEA
===================================== */
export const deleteIdea = async (
  sessionId: string,
  workflowId: string,
  ideaId: string
) => {
  const ref = doc(
    db,
    "sessions",
    sessionId,
    "workflows",
    workflowId,
    "ideas",
    ideaId
  );

  await deleteDoc(ref);
};

/* =====================================
   VOTE / UNVOTE IDEA
===================================== */
export const toggleVoteIdea = async (
  sessionId: string,
  workflowId: string,
  ideaId: string,
  uid: string,
  hasVoted: boolean
) => {
  const ref = doc(
    db,
    "sessions",
    sessionId,
    "workflows",
    workflowId,
    "ideas",
    ideaId
  );

  await updateDoc(ref, {
    [`votes.${uid}`]: hasVoted ? deleteField() : true,
    votesCount: increment(hasVoted ? -1 : 1)
  });
};
