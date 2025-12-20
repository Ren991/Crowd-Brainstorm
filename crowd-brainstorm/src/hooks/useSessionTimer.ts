import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";

export const useSessionTimer = (session: any) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!session?.timer?.startAt) return;

    const start =
      session.timer.startAt instanceof Timestamp
        ? session.timer.startAt.toDate()
        : new Date(session.timer.startAt);

    const duration = session.timer.duration;

    const interval = setInterval(() => {
      const now = new Date();
      const diff =
        duration - Math.floor((now.getTime() - start.getTime()) / 1000);

      setRemainingSeconds(Math.max(diff, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.timer?.startAt, session?.timer?.duration]);

  return { remainingSeconds };
};
