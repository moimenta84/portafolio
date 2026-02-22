import { Link } from "react-router-dom";
import { socialNetworks } from "../../data/social";

const Footer = () => {
  return (
    <footer className="w-full py-3 px-4 bg-transparent backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
        <p className="text-slate-300 text-xs flex items-center gap-2">
          © {new Date().getFullYear()} iker.martinez
          <Link to="/privacy" className="text-white/30 hover:text-white/60 transition-colors">
            Privacidad
          </Link>
          <Link to="/admin" className="text-white/20 hover:text-white/50 transition-colors">
            ·
          </Link>
        </p>

        <div className="flex items-center gap-3 text-slate-300">
          {socialNetworks.map(({ id, src, logo }) => (
            <a
              key={id}
              href={src}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors [&_svg]:w-4 [&_svg]:h-4"
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
