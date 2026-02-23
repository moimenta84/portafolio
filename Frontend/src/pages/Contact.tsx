// Contact.tsx — Página de contacto.
// Combina tres componentes: formulario de contacto (izquierda),
// botón de descarga del CV con animación shimmer, e información
// de contacto con email, teléfono, ubicación y redes sociales.

import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import DownloadCV from "../components/contact/DownloadCV";
import SEO from "../components/SEO";

const Contact = () => {
  return (
    <section className="relative flex-1 flex flex-col justify-center py-6">
      <SEO
        title="Contacto"
        description="¿Tienes un proyecto en mente? Contacta con Iker Martínez, desarrollador Full Stack. Envía los detalles y recibirás una propuesta personalizada. También puedes descargar su CV."
        path="/contact"
      />
      <div className="text-white flex flex-col gap-6">
        {/* TÍTULO */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            ¿Tienes un proyecto en mente?
          </h1>
          <p className="text-sm text-white/70">
            Envíame los detalles y recibirás una propuesta personalizada.
          </p>
        </div>

        {/* GRID DE FORMULARIO E INFO */}
        <div className="grid md:grid-cols-2 gap-6">
          <ContactForm />
          <div className="space-y-4">
            <DownloadCV />
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
