import { DependencyList, EffectCallback, useEffect, useRef } from "react";

/** This hook is a safe version of useEffect that skips the first render when in dev mode.
 * This helps keep the same experience in dev and prod.
 *
 * @param effect the effect to run
 * @param deps the deps to watch
 */
export const useSafeEffect = (
  effect: EffectCallback,
  deps?: DependencyList
) => {
  const firstLoadRef = useRef(process.env.NODE_ENV !== "production");

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return () => {};
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ts and react can't detect that this is correct
  }, deps);
};
