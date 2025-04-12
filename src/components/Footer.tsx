const Footer = () => {
    const year = new Date().getFullYear();
  
    return (
      <footer className="bg-lighter border-t border-dark py-4">
        <div className="container-app">
          <p className="text-sm text-muted text-center">
            DevBills © {year} — Desenvolvido com <strong>React</strong>, <strong>TypeScript</strong> e <strong>Tailwind CSS</strong>
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  