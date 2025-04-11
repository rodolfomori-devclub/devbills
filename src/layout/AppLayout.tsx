import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container-app">
          <p className="text-sm text-gray-500 text-center">
            DevBills © {new Date().getFullYear()} - Desenvolvido com React, TypeScript e Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;