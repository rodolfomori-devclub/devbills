import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-primary-500">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Página não encontrada</h2>
          <p className="mt-3 text-lg text-gray-600">
            A página que você está procurando não existe ou foi removida.
          </p>
        </div>
        <div className="mt-8">
          <Link to="/">
            <Button className="mx-auto">
              <Home className="w-4 h-4 mr-2" />
              Voltar para a página inicial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;