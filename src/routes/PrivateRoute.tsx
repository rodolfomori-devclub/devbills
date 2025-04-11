import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

const PrivateRoute = () => {
  const { authState } = useAuth();

  // Mostrar loading enquanto verifica a autenticação
  if (authState.loading) {
    return <Loading fullScreen text="Verificando autenticação..." />;
  }

  // Redirecionar para login se não estiver autenticado
  if (!authState.user) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar as rotas filhas se estiver autenticado
  return <Outlet />;
};

export default PrivateRoute;