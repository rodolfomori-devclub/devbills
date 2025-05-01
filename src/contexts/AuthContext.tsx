// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";
import type { AuthState } from "../types";

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

  // Monitora mudanças na autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
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
        } else {
          setAuthState({ user: null, loading: false, error: null });
        }
      },
      (error) => {
        console.error("Erro no estado de autenticação:", error);
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
        });
      },
    );

    return () => unsubscribe();
  }, []);

  // Login com Google
  const signInWithGoogle = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao autenticar com o Google";

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  };

  // Logout
  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      await firebaseSignOut(firebaseAuth);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao sair da conta";

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

// Hook personalizado
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }

  return context;
};
