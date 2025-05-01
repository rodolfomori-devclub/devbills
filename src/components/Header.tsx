// src/components/Header.tsx
import type { FC } from "react";
import { Activity, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Interface para os links de navegação
 */
interface NavLink {
  nome: string;
  caminho: string;
}

/**
 * Componente de cabeçalho da aplicação
 * Responsável pela navegação e exibição de informações do usuário
 */
const Header: FC = () => {
  const { authState, signOut } = useAuth();
  const { pathname } = useLocation();
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  const estaAutenticado: boolean = !!authState.user;

  // Lista de links de navegação disponíveis quando autenticado
  const linksNavegacao: NavLink[] = [
    { nome: "Dashboard", caminho: "/dashboard" },
    { nome: "Transações", caminho: "/transactions" },
  ];

  // Renderiza o avatar do usuário
  const renderizarAvatar = () => {
    if (!authState.user) return null;

    if (authState.user.photoURL) {
      return (
        <img
          src={authState.user.photoURL}
          alt={authState.user.displayName || "Usuário"}
          className="w-8 h-8 rounded-full border border-dark"
        />
      );
    }

    // Avatar com a primeira letra do nome quando não há foto
    return (
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
        {authState.user.displayName?.charAt(0) || "U"}
      </div>
    );
  };

  // Alternador do menu mobile
  const alternarMenu = (): void => {
    setMenuAberto(!menuAberto);
  };

  // Fecha o menu e faz logout
  const handleLogout = (): void => {
    signOut();
    setMenuAberto(false);
  };

  return (
    <header className="bg-card border-b border-dark">
      <div className="container-app">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span>DevBills</span>
          </Link>

          {/* Menu desktop */}
          {estaAutenticado && (
            <nav className="hidden md:flex space-x-4">
              {linksNavegacao.map((link) => (
                <Link
                  key={link.caminho}
                  to={link.caminho}
                  className={pathname === link.caminho ? "nav-link-active" : "nav-link"}
                >
                  {link.nome}
                </Link>
              ))}
            </nav>
          )}

          {/* Ações do usuário - desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {estaAutenticado ? (
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="flex items-center space-x-2">
                  {renderizarAvatar()}
                  <span className="text-sm font-medium">
                    {authState.user?.displayName || authState.user?.email}
                  </span>
                </div>

                {/* Botão de logout */}
                <button
                  type="button"
                  onClick={signOut}
                  className="text-muted hover:text-danger p-2 rounded-full hover:bg-opacity-10 hover:bg-red-500 transition-colors"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Entrar
              </Link>
            )}
          </div>

          {/* Botão do menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-muted p-2 rounded-lg hover:bg-lighter transition-colors"
              onClick={alternarMenu}
              aria-expanded={menuAberto}
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            >
              {menuAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div className="md:hidden">
          <div className="container-app py-4 space-y-3 border-t border-dark">
            {estaAutenticado ? (
              <>
                {/* Links de navegação */}
                <nav className="space-y-1">
                  {linksNavegacao.map((link) => (
                    <Link
                      key={link.caminho}
                      to={link.caminho}
                      className={`block px-3 py-2 rounded-lg ${
                        pathname === link.caminho
                          ? "bg-lighter text-primary font-medium"
                          : "text-muted hover:bg-lighter hover:text-primary"
                      }`}
                      onClick={() => setMenuAberto(false)}
                    >
                      {link.nome}
                    </Link>
                  ))}
                </nav>

                {/* Avatar e botão de logout */}
                <div className="flex items-center justify-between pt-3 border-t border-dark">
                  <div className="flex items-center space-x-2">
                    {renderizarAvatar()}
                    <span className="text-sm font-medium">
                      {authState.user?.displayName || authState.user?.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-muted hover:text-danger p-2 rounded-full hover:bg-opacity-10 hover:bg-red-500 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary w-full"
                onClick={() => setMenuAberto(false)}
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
