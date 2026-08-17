import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Store initialValue in a ref to prevent recreating callbacks on inline array/object references
  const initialValueRef = useRef<T>(initialValue);
  initialValueRef.current = initialValue;

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValueRef.current;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValueRef.current;
    } catch {
      return initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        setStoredValue((currentStoredValue) => {
          const newValue = value instanceof Function ? value(currentStoredValue) : value;
          try {
            window.localStorage.setItem(key, JSON.stringify(newValue));
          } catch {
            // Storage quota full or disabled
          }
          return newValue;
        });

        setTimeout(() => {
          try {
            window.dispatchEvent(new Event('local-storage-update'));
          } catch {
            // ignore
          }
        }, 0);
      } catch {
        // Fallback for unexpected write errors
      }
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const latest = readValue();
      setStoredValue((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(latest)) {
          return prev; // Prevent unnecessary state updates if value is unchanged
        }
        return latest;
      });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
}
