// src/layout/AppLayout.tsx
import type { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * Layout principal da aplicação
 * Estrutura a página com cabeçalho, conteúdo principal e rodapé
 */
const AppLayout: FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-grow py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
