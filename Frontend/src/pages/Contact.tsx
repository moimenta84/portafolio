// Contact.tsx — Página de contacto con animaciones y diseño pro.

import { motion } from "framer-motion";
import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import DownloadCV from "../components/contact/DownloadCV";
import SEO from "../components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Contact = () => {
  return (
    <section className="relative flex-1 flex flex-col justify-center py-8">
      <SEO
        title="Contacto — Iker Martínez"
        description="Contacta con Iker Martínez, desarrollador Backend Java en UST. Disponible para proyectos enterprise, microservicios Spring Boot, Kubernetes. Respuesta en menos de 24h."
        path="/contact"
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        className="text-white flex flex-col gap-8"
      >

        {/* HEADER */}
        <motion.div variants={fadeUp} className="text-center max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="section-divider flex-1 max-w-[60px]" />
            <span className="text-secondary font-mono text-[11px] font-semibold tracking-widest uppercase">
              Hablemos
            </span>
            <div className="section-divider flex-1 max-w-[60px]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            ¿Tienes un proyecto{" "}
            <span className="gradient-text">en mente?</span>
          </h1>
          <p className="text-sm md:text-[15px] text-white/55 leading-relaxed">
            Estoy disponible para proyectos enterprise, microservicios y APIs REST. Cuéntame qué necesitas y te respondo en menos de 24 horas.
          </p>
        </motion.div>

        {/* GRID */}
        <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-5">
          <ContactForm />
          <div className="flex flex-col gap-4">
            <DownloadCV />
            <ContactInfo />
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Contact;
