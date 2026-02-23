// SEO.tsx — Componente de metadatos por página.
// React 19 soporta nativamente <title>, <meta> y <link> dentro de componentes:
// los eleva automáticamente al <head> del documento. Sin dependencias externas.

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "profile" | "article";
  noIndex?: boolean;
}

const BASE_URL = "https://ikermartinezdev.com";
const DEFAULT_IMAGE = `${BASE_URL}/img/1760052219751.jpg`;
const SITE_NAME = "Iker Martínez · Dev";

const SEO = ({
  title,
  description,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
}: SEOProps) => {
  const fullTitle = `${title} | Iker Martínez`;
  const url = `${BASE_URL}${path}`;

  return (
    <>
      {/* Básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} — Iker Martínez`} />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${title} — Iker Martínez`} />
    </>
  );
};

export default SEO;
