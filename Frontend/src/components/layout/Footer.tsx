import { socialNetworks } from "../../data/social";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 py-3 px-4" style={{ backgroundColor: "#0f172a" }}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <p className="text-white/40 text-xs">
          © {new Date().getFullYear()} iker.martinez
        </p>

        <div className="flex items-center gap-3 text-white/40">
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
