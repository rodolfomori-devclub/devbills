import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { authState, signOut } = useAuth();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verificar se o usuário está autenticado
  const isAuthenticated = !!authState.user;

  // Links de navegação
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transações', path: '/transactions' },
    { name: 'Categorias', path: '/categories' },
  ];

  // Alternar menu móvel
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fechar menu móvel
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container-app">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary-500 flex items-center space-x-2">
            <span>DevBills</span>
          </Link>

          {/* Links de navegação para desktop */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    pathname === link.path
                      ? 'text-primary-500 font-medium'
                      : 'text-gray-600 hover:text-primary-500'
                  } transition duration-200`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Ações do usuário */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Avatar e nome do usuário */}
                <div className="flex items-center space-x-2">
                  {authState.user?.photoURL ? (
                    <img
                      src={authState.user.photoURL}
                      alt={authState.user.displayName || 'Usuário'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                      {authState.user?.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {authState.user?.displayName || authState.user?.email}
                  </span>
                </div>

                {/* Botão de logout */}
                <button
                  onClick={signOut}
                  className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Botão de menu móvel */}
          <button
            className="md:hidden text-gray-500 p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu móvel */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container-app py-4 space-y-3 border-t">
            {isAuthenticated && (
              <>
                {/* Links de navegação */}
                <nav className="space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-2 py-2 rounded-md ${
                        pathname === link.path
                          ? 'bg-primary-50 text-primary-500 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={closeMenu}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Informações do usuário */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    {authState.user?.photoURL ? (
                      <img
                        src={authState.user.photoURL}
                        alt={authState.user.displayName || 'Usuário'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                        {authState.user?.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {authState.user?.displayName || authState.user?.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <Link
                to="/login"
                className="btn btn-primary w-full"
                onClick={closeMenu}
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;