import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "@/app/firebase";

/* export const createNewWorkflow = async (
  sessionId: string,
  title = "Nuevo dashboard"
) => {
  const workflowsRef = collection(db, "sessions", sessionId, "workflows");

  const batch = writeBatch(db);

  // 1️⃣ Crear workflow
  const newWorkflowRef = doc(workflowsRef);
  batch.set(newWorkflowRef, {
    title,
    phase: "IDEAS",
    isActive: true,
    timer: null,
    createdAt: serverTimestamp()
  });

  // 2️⃣ Actualizar sesión
  batch.update(doc(db, "sessions", sessionId), {
    activeWorkflowId: newWorkflowRef.id
  });

  await batch.commit();

  return newWorkflowRef.id;
}; */
export const createNewWorkflow = async (
  sessionId: string,
  title: string
) => {
  const workflowRef = await addDoc(
    collection(db, "sessions", sessionId, "workflows"),
    {
      title,
      phase: "submission",
      createdAt: serverTimestamp(),
    }
  );

  await updateDoc(doc(db, "sessions", sessionId), {
    activeWorkflowId: workflowRef.id,
    phase: "submission",
  });

  return workflowRef.id;
};

