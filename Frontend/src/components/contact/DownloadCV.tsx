// DownloadCV.tsx — Botón de descarga del CV en PDF con efectos visuales.
// Descarga directamente el archivo real desde public/Pdf/.
// Efectos con Framer Motion: shimmer brillante en el botón, hover scale,
// press shrink, y transición animada "Descargar CV" → "Descargado".

import { useState } from "react";
import { Download, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CV_PATH = "/Pdf/curriculumIkerMartinez.pdf";
const CV_FILENAME = "Iker_Martinez_CV.pdf";

const DownloadCV = () => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = CV_PATH;
    link.download = CV_FILENAME;
    link.click();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="text-red-400" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm">Curriculum Vitae</p>
          <p className="text-white/40 text-xs">{CV_FILENAME} - PDF</p>
        </div>
      </div>

      <motion.button
        onClick={handleDownload}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative w-full overflow-hidden flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-xl cursor-pointer text-sm"
      >
        {/* Shimmer effect */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
        />

        <AnimatePresence mode="wait">
          {downloaded ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 relative z-10"
            >
              <CheckCircle size={16} />
              Descargado
            </motion.span>
          ) : (
            <motion.span
              key="download"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 relative z-10"
            >
              <Download size={16} />
              Descargar CV
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default DownloadCV;
