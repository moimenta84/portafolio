import { MotionTransition } from "../animations/transition-components";

const AvatarPortfolio = () => {
  return (
    <MotionTransition
      position="bottom"
      className="bottom-0 left-0 hidden md:inline-block md:absolute"
    >
      <img
        src="/avatar-works.png"
        width={600}
        height={600}
        className="w-full h-full"
        alt="Avatar portfolio"
      />
    </MotionTransition>
  );
};

export default AvatarPortfolio;
