import { MotionTransition } from "../animations/transition-components";

const AvatarPortfolio = () => {
  return (
    <MotionTransition position="bottom">
      <div className="scale-125 origin-bottom-left">
        <img
          src="/avatar-1.png" // <-- Usa uno que ya funcione
          alt="Walking avatar"
          className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-2xl"
          onLoad={() => console.log("Avatar cargado!")}
          onError={(e) => console.error("Error cargando avatar:", e)}
        />
      </div>
    </MotionTransition>
  );
};

export default AvatarPortfolio;
