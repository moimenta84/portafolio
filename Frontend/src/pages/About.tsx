import TimeLine from "../components/timeLine/TimeLine";
import CounterServices from "../services/CounterServices";

const About = () => {
  return (
    <section className="relative flex-1 flex flex-col justify-center py-4">
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-white w-full space-y-4">

        {/* HEADER */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">trayectoria</span>
          </h2>
          <p className="text-xs text-white/40 mt-1">
            Del primer <code className="text-cyan-400/60 bg-white/5 px-1 rounded">console.log</code> al deploy en producción
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <CounterServices />
        </div>

        {/* JOURNEY CARDS */}
        <TimeLine />

      </div>
    </section>
  );
};

export default About;
