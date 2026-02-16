// ContactInfo.tsx — Panel de información de contacto.
// Muestra email, teléfono, ubicación, redes sociales y horario de disponibilidad.
// Cada dato tiene un icono naranja de Lucide y enlace clicable.

import { Mail, MapPin, Phone } from "lucide-react";
import { socialNetworks } from "../../data/social";

const ContactInfo = () => {
  return (
    <div className="space-y-4">
      {/* Datos de contacto */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
        <h2 className="text-base font-bold mb-3">Información de contacto</h2>

        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="text-orange-400" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Email</h3>
              <a
                href="mailto:ikerastra@hotmail.com"
                className="text-white/80 hover:text-orange-400 transition text-xs"
              >
                ikerastra@hotmail.com
              </a>
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="text-orange-400" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Teléfono</h3>
              <a
                href="tel:+34660655985"
                className="text-white/80 hover:text-orange-400 transition text-xs"
              >
                660 655 985
              </a>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="text-orange-400" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Ubicación</h3>
              <p className="text-white/80 text-xs">Vergel (Alicante), España</p>
            </div>
          </div>
        </div>
      </div>

      {/* Redes Sociales + Disponibilidad en fila */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h2 className="text-base font-bold mb-3">Sígueme en</h2>
          <div className="flex gap-3">
            {socialNetworks.map((network) => (
              <a
                key={network.id}
                href={network.src}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-orange-400 rounded-lg flex items-center justify-center transition"
              >
                {network.logo}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h2 className="text-base font-bold mb-3">Disponibilidad</h2>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-white/80">L-V</span>
              <span className="text-white font-semibold">9:00 - 18:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Fines de semana</span>
              <span className="text-white font-semibold">Bajo petición</span>
            </div>
          </div>
          <p className="text-orange-400 font-semibold text-xs mt-2">
            Respuesta: 24-48h
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
