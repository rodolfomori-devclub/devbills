import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-grow py-6">
        <Outlet />
      </main>
      <footer className="bg-lighter border-t border-dark py-4">
        <div className="container-app">
          <p className="text-sm text-muted text-center">
            DevBills © {new Date().getFullYear()} - Desenvolvido com React, TypeScript e Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;