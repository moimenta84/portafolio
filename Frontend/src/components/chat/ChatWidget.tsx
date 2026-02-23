import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { sendChat } from "../../services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mostrar la etiqueta 1.5s después de montar y ocultarla a los 6s
  useEffect(() => {
    const show = setTimeout(() => setShowLabel(true), 1500);
    const hide = setTimeout(() => setShowLabel(false), 6000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      // Enviar solo los últimos 6 turnos (3 intercambios) como historial
      const history = updated.slice(-7, -1).map(({ role, content }) => ({ role, content }));
      const { reply } = await sendChat(text, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply ?? "" }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al conectar";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: msg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Panel de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 right-4 z-40 w-80 sm:w-96 flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden"
            style={{ maxHeight: "min(480px, calc(100dvh - 180px))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-cyan-400" />
                <span className="text-sm font-semibold text-white">Pregúntale a Iker</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.length === 0 && (
                <p className="text-xs text-white/40 text-center pt-6">
                  Hola! Pregúntame sobre el stack, proyectos o disponibilidad de Iker.
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <span
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30"
                        : "bg-white/8 text-white/90 border border-white/10"
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <span className="flex items-center gap-1.5 rounded-xl px-3 py-2 bg-white/8 border border-white/10">
                    <Loader2 size={13} className="animate-spin text-cyan-400" />
                    <span className="text-xs text-white/50">Pensando…</span>
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-white/10 bg-white/3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje…"
                disabled={loading}
                className="flex-1 rounded-xl bg-white/8 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                aria-label="Enviar mensaje"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Etiqueta flotante junto al botón */}
      <AnimatePresence>
        {showLabel && !open && (
          <motion.div
            key="chat-label"
            initial={{ opacity: 0, x: 12, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-[6.75rem] right-[4.5rem] z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a0a0a] border border-cyan-500/30 shadow-lg pointer-events-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-white/80 whitespace-nowrap">
              Habla con el asistente de Iker
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <button
        onClick={() => { setOpen((v) => !v); setShowLabel(false); }}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        className="fixed bottom-[5.5rem] right-4 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-lg hover:bg-cyan-500/30 hover:scale-105 transition-all"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}
