import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export const useEffectOnce = (
  effect: EffectCallback,
  deps?: DependencyList
) => {
  const firstLoadRef = useRef(true);

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return effect();
    }
  }, deps);
};
