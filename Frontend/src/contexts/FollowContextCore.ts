// FollowContextCore.ts — Definición del contexto y el hook de seguimiento.
// Separado de FollowContext.tsx (que solo exporta el Provider/componente)
// para cumplir con la regla react-refresh/only-export-components.

import { createContext, useContext } from "react";

export interface FollowContextType {
  followersCount: number;
  following: boolean;
  openModal: () => void;
  handleUnfollow: () => void;
}

export const FollowContext = createContext<FollowContextType | null>(null);

export function useFollow() {
  const ctx = useContext(FollowContext);
  if (!ctx) throw new Error("useFollow must be used inside FollowProvider");
  return ctx;
}
