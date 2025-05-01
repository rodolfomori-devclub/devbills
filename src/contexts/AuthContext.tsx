import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { firebaseAuth, googleAuthProvider } from '../config/firebase';
import type { AuthState } from '../types';

// Tipagem do contexto de autenticação
interface AuthContextProps {
  authState: AuthState;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Monitorar alterações no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
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
          // Removida a chamada para /users/initialize
        } else {
          // Usuário não autenticado
          setAuthState({ user: null, loading: false, error: null });
        }
      },
      (error) => {
        console.error('Erro no estado de autenticação:', error);
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
        });
      }
    );

    return () => unsubscribe();
  }, []);

  // Login com Google
  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Erro ao autenticar com o Google';

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));
      await firebaseSignOut(firebaseAuth);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Erro ao sair da conta';

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir contexto
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>');
  }
  return context;
};