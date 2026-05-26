import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Ctx = {
  setStat: (stat: ReactNode | null) => void;
};

const PersonalityStatContext = createContext<Ctx | null>(null);

export function PersonalityStatProvider({
  onChange,
  children,
}: {
  onChange: (stat: ReactNode | null) => void;
  children: ReactNode;
}) {
  return (
    <PersonalityStatContext.Provider value={{ setStat: onChange }}>
      {children}
    </PersonalityStatContext.Provider>
  );
}

/**
 * Components rendered inside a ComponentShowcase Preview can publish a
 * personality stat to the surrounding footer by calling this hook.
 * Safe to call outside the showcase — becomes a no-op.
 */
export function usePersonalityStat(stat: ReactNode | null) {
  const ctx = useContext(PersonalityStatContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.setStat(stat);
    return () => ctx.setStat(null);
  }, [ctx, stat]);
}

/** Hook for the showcase itself to manage the dynamic-stat slot. */
export function useDynamicStatSlot() {
  const [stat, setStat] = useState<ReactNode | null>(null);
  return { stat, setStat };
}
