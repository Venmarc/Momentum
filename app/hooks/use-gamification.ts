import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GamificationState {
  xp: number;
  level: number;
  addXp: (amount: number) => void;
  calculateLevel: (totalXp: number) => { level: number; remainingXp: number; nextLevelXp: number };
}

export const useGamification = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      addXp: (amount) => {
        const newXp = get().xp + amount;
        const { level } = get().calculateLevel(newXp);
        set({ xp: newXp, level });
      },
      calculateLevel: (totalXp) => {
        let level = 1;
        let xpNeeded = 100;
        let remaining = totalXp;

        while (remaining >= xpNeeded) {
          remaining -= xpNeeded;
          level++;
          xpNeeded = Math.round(100 * Math.pow(1.2, level - 1));
        }

        return { level, remainingXp: remaining, nextLevelXp: xpNeeded };
      }
    }),
    {
      name: 'momentum-gamification'
    }
  )
);
