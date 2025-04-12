import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// 🔐 Configurações vindas de variáveis de ambiente (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} as const;

// 🚀 Inicializar app Firebase
const firebaseApp = initializeApp(firebaseConfig);

// 🔑 Serviços de autenticação
const firebaseAuth = getAuth(firebaseApp);
const googleAuthProvider = new GoogleAuthProvider();

// ✅ Exports nominais e claros para reutilização
export { firebaseApp, firebaseAuth, googleAuthProvider };
