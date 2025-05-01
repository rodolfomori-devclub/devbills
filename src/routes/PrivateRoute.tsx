// src/routes/PrivateRoute.tsx
import type { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

/**
 * Componente que protege rotas que requerem autenticação
 * Redireciona para a página de login se o usuário não estiver autenticado
 */
const PrivateRoute: FC = () => {
  const { authState } = useAuth();

  // Enquanto a autenticação está sendo verificada, mostra o loading
  if (authState.loading) {
    return <Loading fullScreen size="large" text="Verificando autenticação..." />;
  }

  // Se o usuário não estiver autenticado, redireciona para o login
  if (!authState.user) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza as rotas filhas
  return <Outlet />;
};

export default PrivateRoute;
