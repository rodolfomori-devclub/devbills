// src/contexts/AuthContext.tsx
import type { FC } from "react";
import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";
import type { AuthState } from "../types";

interface AuthContextProps {
  authState: AuthState;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          setAuthState({
            user: mapUserData(user),
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

  const mapUserData = (user: User) => ({
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  });

  const signInWithGoogle = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao autenticar com o Google";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  };

  const signOut = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
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

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }

  return context;
};
