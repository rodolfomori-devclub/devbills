import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { AuthState } from '../types';
import api from '../services/api';

// Definindo a interface para o contexto de autenticação
interface AuthContextProps {
  authState: AuthState;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Criando o contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provedor do contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Monitorar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          // Usuário autenticado
          setAuthState({
            user: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            },
            loading: false,
            error: null,
          });

          // Inicializar o usuário na API (criar categorias padrão)
          initializeUser();
        } else {
          // Usuário não autenticado
          setAuthState({
            user: null,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
        });
      }
    );

    // Cleanup da inscrição quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Inicializar o usuário na API
  const initializeUser = async () => {
    try {
      await api.post('/users/initialize');
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  };

  // Login com Google
  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao fazer login com o Google',
      }));
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign-out error:', error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao fazer logout',
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};