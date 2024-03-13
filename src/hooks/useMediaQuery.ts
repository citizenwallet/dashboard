import { useState, useEffect } from "react";

function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState(true as boolean | undefined);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export default useMediaQuery;
