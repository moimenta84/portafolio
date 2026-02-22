// ContactForm.tsx — Formulario de contacto con campos de nombre, email, asunto y mensaje.
// Simula el envío con un delay de 1.5s y muestra un mensaje de éxito durante 5 segundos.
// Los inputs usan estilos glassmorphism y el borde cambia a naranja al hacer focus.

import { useState } from "react";
import { Send } from "lucide-react";
import { registerEvent } from "../../services/api";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
      <h2 className="text-lg font-bold mb-3">Envíame un mensaje</h2>

      {success && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-2 mb-3">
          <p className="text-sm">¡Mensaje enviado con éxito! Te responderé pronto.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 mb-3">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Nombre y Email en fila */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Nombre *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-400 transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-400 transition text-sm"
            />
          </div>
        </div>

        {/* Asunto */}
        <div>
          <label className="block text-xs font-medium mb-1">Asunto *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="¿De qué quieres hablar?"
            required
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-400 transition text-sm"
          />
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-xs font-medium mb-1">Mensaje *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Cuéntame sobre tu proyecto..."
            required
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-400 transition resize-none text-sm"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? (
            <>Enviando...</>
          ) : (
            <>
              <Send size={16} />
              Enviar Mensaje
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
