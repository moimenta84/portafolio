// ContactForm.tsx — Formulario de contacto con design system pro.

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registerEvent } from "../../services/api";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const inputClass = `
  w-full px-4 py-2.5 rounded-xl
  bg-white/[0.04] border border-white/10 text-white text-sm
  placeholder:text-white/30 leading-relaxed
  focus:outline-none focus:border-secondary/60 focus:bg-secondary/5
  transition-all duration-200
`;

const labelClass = "block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wide";

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", subject: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al enviar");

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      registerEvent("contact_submit");
      setTimeout(() => setSuccess(false), 6000);
    } catch {
      setError("No se pudo enviar. Inténtalo de nuevo o escríbeme directamente.");
      setTimeout(() => setError(""), 6000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-5 md:p-6 border border-white/8">
      <h2 className="text-lg font-black text-white mb-1">Envíame un mensaje</h2>
      <p className="text-xs text-white/45 mb-5">Respondo en menos de 24 horas, generalmente antes.</p>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-4"
            role="alert"
          >
            <CheckCircle size={16} className="text-green-400 shrink-0" aria-hidden="true" />
            <p className="text-sm text-green-300 font-medium">¡Mensaje enviado! Te responderé pronto.</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4"
            role="alert"
          >
            <AlertCircle size={16} className="text-red-400 shrink-0" aria-hidden="true" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClass}>Nombre *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              autoComplete="name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className={labelClass}>Asunto *</label>
          <input
            id="subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="¿De qué quieres hablar?"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>Mensaje *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Cuéntame tu proyecto o deja tu contacto..."
            required
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-label="Enviar mensaje de contacto"
          className="group w-full px-4 py-2.5 bg-secondary text-main font-black rounded-xl
                     hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/30
                     active:translate-y-0 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                     flex items-center justify-center gap-2 text-sm relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          <span className="relative flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={15} aria-hidden="true" />
                Enviar mensaje
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
