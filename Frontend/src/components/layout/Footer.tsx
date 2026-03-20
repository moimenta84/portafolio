import { Link } from "react-router-dom";
import { socialNetworks } from "../../data/social";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full py-3 px-4" aria-label="Pie de página">
      <div className="flex items-center justify-between gap-4 max-w-[1400px] mx-auto">
        <p className="text-white/30 text-xs flex items-center gap-2 font-mono">
          <span>&copy; {year} iker.martinez</span>
          <span className="text-white/15">·</span>
          <Link
            to="/privacy"
            className="hover:text-white/60 transition-colors focus-visible:text-secondary focus-visible:outline-none"
          >
            Privacidad
          </Link>
          <Link
            to="/admin"
            aria-label="Panel de administración"
            className="text-white/10 hover:text-white/30 transition-colors focus-visible:outline-none"
          >
            ·
          </Link>
        </p>

        <div className="flex items-center gap-3 text-white/40">
          {socialNetworks.map(({ id, src, logo }) => (
            <a
              key={id}
              href={src}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-secondary transition-colors duration-200 [&_svg]:w-3.5 [&_svg]:h-3.5 focus-visible:outline-none focus-visible:text-secondary"
            >
              {logo}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
