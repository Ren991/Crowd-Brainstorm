import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase';

export const testFirestoreConnection = async () => {
  try {
    const testRef = collection(db, 'test');
    const snapshot = await getDocs(testRef);

    console.log('✅ Firestore conectado correctamente');
    console.log('📦 Cantidad de documentos:', snapshot.size);
  } catch (error) {
    console.error('❌ Error conectando con Firestore:', error);
  }
};
