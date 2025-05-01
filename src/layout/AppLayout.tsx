import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import Footer from '../components/Footer'; // novo componente separado

const AppLayout = () => {
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
