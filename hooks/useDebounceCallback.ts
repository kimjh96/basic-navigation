import { useCallback, useEffect, useRef } from "react";

function useDebounceCallback(callback: () => void, delay: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedCallback = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

export default useDebounceCallback;
