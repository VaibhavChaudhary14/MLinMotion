import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Analog Bauhaus Motion Physics
export const mechanicalLatch = {
  type: "spring" as const,
  stiffness: 700,
  damping: 35,
  mass: 0.5,
};

export const needleDeflection = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
  mass: 1,
};

export const pointTransition = {
  type: "tween" as const,
  duration: 0.32,
  ease: [0.25, 1, 0.5, 1],
};
