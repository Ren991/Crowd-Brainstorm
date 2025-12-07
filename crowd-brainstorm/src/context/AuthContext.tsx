import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase';
import type { IUser } from '@/interfaces/User';
import { getUserFromFirestore } from '@/services/userService';

interface AuthContextProps {
  user: IUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const firestoreUser = await getUserFromFirestore(firebaseUser.uid);

        if (firestoreUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            ...firestoreUser
          });
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || ''
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
