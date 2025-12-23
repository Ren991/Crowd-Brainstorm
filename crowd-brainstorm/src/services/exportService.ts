import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "@/app/firebase";

export const getSessionForExport = async (sessionId: string) => {
  // sesión
  const sessionSnap = await getDoc(doc(db, "sessions", sessionId));
  if (!sessionSnap.exists()) throw new Error("Sesión no encontrada");

  const session = { id: sessionSnap.id, ...sessionSnap.data() };

  // workflows
  const workflowsSnap = await getDocs(
    query(
      collection(db, "sessions", sessionId, "workflows"),
      orderBy("createdAt", "asc")
    )
  );

  const workflows = [];

  for (const wf of workflowsSnap.docs) {
    const workflow = { id: wf.id, ...wf.data() };

    // ideas del workflow
    const ideasSnap = await getDocs(
      query(
        collection(
          db,
          "sessions",
          sessionId,
          "workflows",
          wf.id,
          "ideas"
        ),
        orderBy("votesCount", "desc")
      )
    );

    const ideas = ideasSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    workflows.push({ ...workflow, ideas });
  }

  return { session, workflows };
};
