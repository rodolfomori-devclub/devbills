// src/pages/Login.tsx
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login: FC = () => {
  const { authState, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.user && !authState.loading) {
      navigate("/dashboard");
    }
  }, [authState.user, authState.loading, navigate]);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">DevBills</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Gerencie suas finanças de forma simples e eficiente
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Faça login para continuar</h2>
              <p className="mt-1 text-sm text-gray-500">
                Acesse sua conta para começar a gerenciar suas finanças
              </p>
            </div>

            <div className="space-y-4">
              <GoogleLoginButton onClick={handleGoogleLogin} isLoading={authState.loading} />
            </div>

            {authState.error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded" role="alert">
                <p>{authState.error}</p>
              </div>
            )}

            <div className="mt-6">
              <p className="text-center text-xs text-gray-500">
                Ao fazer login, você concorda com nossos termos de uso e política de privacidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
