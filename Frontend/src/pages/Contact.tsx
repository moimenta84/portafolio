// Contact.tsx — Página de contacto.
// Combina tres componentes: formulario de contacto (izquierda),
// botón de descarga del CV con animación shimmer, e información
// de contacto con email, teléfono, ubicación y redes sociales.

import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import DownloadCV from "../components/contact/DownloadCV";

const Contact = () => {
  return (
     <section className="relative flex-1 flex flex-col justify-center py-4">
      <div className="max-w-6xl mx-auto text-white px-4 md:px-6 w-full">
        {/* TÍTULO */}
        <div className="text-center mb-4">
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
