import { useEffect, useRef } from 'react';

/**
 * Runs `callback` every `delay` ms. Pass `delay = null` to pause.
 * Captures the latest callback via ref so consumers don't need to memoize.
 */
export function useInterval(callback: () => void, delay: number | null) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = window.setInterval(() => saved.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}
