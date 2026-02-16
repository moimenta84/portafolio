// Footer.tsx
const Footer = () => {
  return (
    <footer className="w-full bg-transparent text-white py-6 text-center">
      <p className="opacity-70">
        © {new Date().getFullYear()} Iker Dev — Todos los derechos reservados
      </p>
    </footer>
  );
};

export default Footer;