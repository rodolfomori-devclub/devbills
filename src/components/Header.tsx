// src/components/Header.tsx
import { Activity, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { authState, signOut } = useAuth();
  const { pathname } = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  const estaAutenticado = !!authState.user;

  const linksNavegacao = [
    { nome: "Dashboard", caminho: "/dashboard" },
    { nome: "Transações", caminho: "/transactions" },
  ];

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
                  {authState.user?.photoURL ? (
                    <img
                      src={authState.user.photoURL}
                      alt={authState.user.displayName || "Usuário"}
                      className="w-8 h-8 rounded-full border border-dark"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                      {authState.user?.displayName?.charAt(0) || "U"}
                    </div>
                  )}
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
              onClick={() => setMenuAberto(!menuAberto)}
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
                    {authState.user?.photoURL ? (
                      <img
                        src={authState.user.photoURL}
                        alt={authState.user.displayName || "Usuário"}
                        className="w-8 h-8 rounded-full border border-dark"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                        {authState.user?.displayName?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {authState.user?.displayName || authState.user?.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMenuAberto(false);
                    }}
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
