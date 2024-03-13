import { useCallback, useRef } from "react";
import { useSafeEffect } from "./useSafeEffect";

export const useScrollBottomCallback = (
  scrollRef: React.RefObject<HTMLDivElement>,
  callback: () => void,
  deps: any[] = []
) => {
  const firstLoadRef = useRef(true);

  const stableCallback = useCallback(
    () => {
      callback();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, ...deps]
  );

  useSafeEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        stableCallback();
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [stableCallback]);
};
