// src/pages/Home.tsx
import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, TrendingUp, List, CreditCard } from "lucide-react";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Home: FC = () => {
  const { authState, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (authState.user && !authState.loading) {
      navigate("/dashboard");
    }
  }, [authState.user, authState.loading, navigate]);

  const features: ReadonlyArray<Feature> = [
    {
      icon: <Wallet className="w-8 h-8 text-primary" />,
      title: "Controle Financeiro",
      description:
        "Monitore suas despesas e receitas em um só lugar, com uma interface intuitiva e fácil de usar.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Relatórios",
      description: "Visualize graficamente seus gastos e entenda para onde seu dinheiro está indo.",
    },
    {
      icon: <List className="w-8 h-8 text-primary" />,
      title: "Categorias Personalizadas",
      description: "Organize suas transações em categorias para melhor análise.",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "Transações Ilimitadas",
      description:
        "Adicione quantas transações quiser e mantenha um histórico completo de suas finanças.",
    },
  ];

  const handleLogin = () => {
    signInWithGoogle();
  };

  return (
    <div className="bg-app min-h-screen">
      <div className="container-app">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Gerencie suas finanças com o <span className="text-primary">DevBills</span>
              </h1>
              <p className="text-lg text-white mb-8">
                Uma plataforma simples e eficiente para controlar suas despesas e receitas. Organize
                suas finanças pessoais ou do seu negócio com facilidade.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleLogin}
                  className="text-center px-6 py-3"
                  isLoading={authState.loading}
                >
                  Começar Agora
                </Button>
              </div>
            </div>
            <div className="flex justify-center">{/* Imagem ou ilustração opcional */}</div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-20 bg-card rounded-xl">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Recursos do DevBills</h2>
              <p className="text-lg text-white max-w-2xl mx-auto">
                Nossa plataforma oferece tudo o que você precisa para manter suas finanças
                organizadas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-lighter p-6 rounded-xl hover:shadow-lg transition duration-200 hover:shadow-primary/10 border border-border"
                >
                  <div className="mb-4 bg-primary/10 p-3 rounded-full inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-text-muted">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20">
          <div className="bg-card rounded-xl p-8 md:p-12 text-center border border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Pronto para organizar suas finanças?
            </h2>
            <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
              Comece a usar o DevBills hoje mesmo e tenha o controle total sobre seu dinheiro. É
              gratuito e fácil de usar!
            </p>
            <Button onClick={handleLogin} className="px-6 py-3" isLoading={authState.loading}>
              Criar Conta Gratuita
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-primary">DevBills</h3>
              <p className="text-text-muted text-sm">
                © {currentYear} - Todos os direitos reservados
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
