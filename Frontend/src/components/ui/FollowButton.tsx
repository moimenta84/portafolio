import { UserPlus, UserCheck } from "lucide-react";
import { useFollow } from "../../contexts/FollowContext";

interface FollowButtonProps {
  size?: "sm" | "lg";
  showCount?: boolean;
}

const FollowButton = ({ size = "sm", showCount = false }: FollowButtonProps) => {
  const { followersCount, following, openModal, handleUnfollow } = useFollow();
  const isLg = size === "lg";

  return (
    <button
      onClick={following ? handleUnfollow : openModal}
      className={`flex items-center gap-2 rounded-full font-medium transition-all ${
        following
          ? "bg-secondary text-white shadow-lg shadow-secondary/25"
          : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
      } ${isLg ? "px-5 py-2.5 text-sm" : "px-3 py-1.5 text-sm"}`}
    >
      {following ? <UserCheck size={isLg ? 16 : 14} /> : <UserPlus size={isLg ? 16 : 14} />}
      {following ? "Siguiendo" : "Seguir"}
      {showCount && followersCount > 0 && (
        <span className="text-xs opacity-60">{followersCount}</span>
      )}
    </button>
  );
};

export default FollowButton;
