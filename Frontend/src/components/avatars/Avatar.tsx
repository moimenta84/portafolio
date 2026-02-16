import { MotionTransition } from "../animations/transition-components";

const Avatar = () => {
  return (
    <MotionTransition
      position="bottom"
      className="bottom-0 right-0 hidden md:inline-block md:absolute"
    >
      <img
        src="../../../public/img/home-4.png" // <-- Usa uno que ya funcione
        alt="Walking avatar"
        className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-2xl"
        onLoad={() => console.log("Avatar cargado!")}
        onError={(e) => console.error("Error cargando avatar:", e)}
      />
    </MotionTransition>
  );
};

export default Avatar;
