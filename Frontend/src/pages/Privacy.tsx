import SEO from "../components/SEO";

const Privacy = () => {
  return (
    <section className="flex-1 px-4 md:px-6 py-8 overflow-y-auto">
      <SEO
        title="Política de Privacidad"
        description="Política de privacidad del portfolio de Iker Martínez. Información sobre el tratamiento de datos, cookies y derechos RGPD."
        path="/privacy"
        noIndex={true}
      />
      <div className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed space-y-6">

        <div>
          <h1 className="text-xl font-bold text-white mb-1">Política de Privacidad</h1>
          <p className="text-xs text-white/40">Última actualización: febrero de 2025</p>
        </div>

        <Section title="1. Responsable del tratamiento">
          El responsable del tratamiento de los datos recogidos a través de este sitio web es{" "}
          <strong className="text-white">Iker Martínez</strong>, con domicilio en Vergel (Alicante),
          España, contactable en{" "}
          <a href="mailto:moimenta267@gmail.com" className="text-cyan-400 hover:underline">
            moimenta267@gmail.com
          </a>.
        </Section>

        <Section title="2. Qué datos recogemos y por qué">
          <p className="mb-3">
            Este sitio web recoge de forma automática los siguientes datos con la finalidad exclusiva
            de obtener estadísticas de visita anónimas:
          </p>
          <ul className="space-y-2 list-none">
            <Item label="Dirección IP parcial">
              Se registran únicamente los primeros tres octetos (p. ej. 192.168.1.xxx). El último
              octeto se descarta de forma inmediata y nunca se almacena.
            </Item>
            <Item label="País y provincia de origen">
              Obtenidos a partir de la IP parcial mediante geolocalización, con el único fin de saber
              desde qué regiones se visita el sitio.
            </Item>
            <Item label="Tipo de red">
              Residencial o corporativa, inferido del proveedor de red (ISP), sin identificar a
              ninguna empresa ni persona en particular.
            </Item>
            <Item label="Páginas visitadas y hora de visita">
              Para conocer qué secciones del sitio generan más interés.
            </Item>
            <Item label="Duración de la visita">
              Tiempo aproximado de permanencia en el sitio, calculado en el navegador y enviado de
              forma anónima al cerrar la pestaña.
            </Item>
            <Item label="Origen del tráfico (referrer)">
              Dominio desde el que se accede al sitio (p. ej. linkedin.com, github.com o acceso
              directo), sin almacenar la URL completa.
            </Item>
          </ul>
          <p className="mt-3">
            No recogemos nombre, apellidos, correo electrónico ni ningún otro dato que permita
            identificarte directamente, salvo que tú mismo nos lo facilites a través del formulario
            de contacto (véase sección 4).
          </p>
          <p className="mt-2">
            La base jurídica del tratamiento es el interés legítimo del responsable (art. 6.1.f
            RGPD) en conocer el uso agregado y anónimo de su sitio web.
          </p>
        </Section>

        <Section title="3. Cookies y almacenamiento local">
          <p className="mb-2">Este sitio web no utiliza cookies de ningún tipo.</p>
          <p>
            Para evitar contabilizar múltiples veces la misma visita dentro de una sesión, se utiliza{" "}
            <code className="text-cyan-400 font-mono text-xs">sessionStorage</code>, un almacenamiento
            temporal del navegador que se elimina automáticamente al cerrar la pestaña. No permite
            rastrear al usuario entre sesiones ni entre sitios web distintos, y no requiere
            consentimiento según la normativa vigente (Directiva ePrivacy y LSSI).
          </p>
        </Section>

        <Section title="4. Formulario de contacto">
          Si utilizas el formulario de contacto, los datos que introduzcas se utilizarán
          exclusivamente para responder a tu consulta. No se cederán a terceros ni se usarán con
          fines comerciales. Puedes solicitar su eliminación escribiendo a{" "}
          <a href="mailto:moimenta267@gmail.com" className="text-cyan-400 hover:underline">
            moimenta267@gmail.com
          </a>.
        </Section>

        <Section title="5. Cuánto tiempo conservamos los datos">
          Los datos estadísticos anonimizados (IP parcial, provincia, páginas vistas) se conservan
          durante un máximo de 12 meses, tras los cuales se eliminan automáticamente. Los datos del
          formulario de contacto se conservan únicamente el tiempo necesario para gestionar tu
          consulta.
        </Section>

        <Section title="6. Con quién compartimos los datos">
          <p className="mb-2">Los datos recogidos no se ceden ni venden a terceros.</p>
          <p>
            Para la geolocalización de la IP se realiza una consulta al servicio externo{" "}
            <a
              href="https://ip-api.com/docs/legal"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              ip-api.com
            </a>{" "}
            (operado fuera de la UE). Dicha consulta se realiza en el momento de la visita y
            únicamente se almacena localmente el resultado (provincia y tipo de red), nunca la IP
            completa.
          </p>
        </Section>

        <Section title="7. Tus derechos">
          De acuerdo con el RGPD, tienes derecho a acceder, rectificar, suprimir, limitar u oponerte
          al tratamiento de tus datos personales. Dado que los datos estadísticos son anónimos desde
          el momento de su recogida, no es posible asociarlos a una persona concreta. Para cualquier
          consulta sobre datos del formulario de contacto, escribe a{" "}
          <a href="mailto:moimenta267@gmail.com" className="text-cyan-400 hover:underline">
            moimenta267@gmail.com
          </a>. Si consideras que el tratamiento no se ajusta a la normativa, puedes reclamar ante la{" "}
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            Agencia Española de Protección de Datos (AEPD)
          </a>.
        </Section>

        <p className="text-xs text-white/30 border-t border-white/10 pt-4">
          Este sitio web no requiere banner de cookies al no utilizar ninguna tecnología de
          rastreo persistente.
        </p>
      </div>
    </section>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-base font-semibold text-white mb-2">{title}</h2>
    <div className="text-white/70">{children}</div>
  </div>
);

const Item = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <li className="flex gap-2">
    <span className="text-cyan-400 shrink-0">·</span>
    <span>
      <strong className="text-white/90">{label}:</strong> {children}
    </span>
  </li>
);

export default Privacy;
