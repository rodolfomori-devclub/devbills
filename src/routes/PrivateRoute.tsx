import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

const PrivateRoute = () => {
  const { authState } = useAuth();

  // 🔄 Enquanto o estado de autenticação está carregando...
  if (authState.loading) {
    return <Loading fullScreen text="Verificando autenticação..." />;
  }

  // 🚫 Se o usuário NÃO estiver autenticado, redirecionar para o login
  if (!authState.user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Se estiver autenticado, renderizar as rotas filhas
  return <Outlet />;
};

export default PrivateRoute;
