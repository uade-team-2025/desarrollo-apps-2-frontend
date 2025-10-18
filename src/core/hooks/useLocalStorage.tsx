import { useCallback, useEffect, useRef, useState } from 'react';

type StorageValue<T> = T;

interface UseLocalStorageReturn<T> {
  value: StorageValue<T>;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  error: Error | null;
}

function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<StorageValue<T>>(() => {
    try {
      const item = localStorage.getItem(key);
      if (typeof initialValue === 'string') {
        return item ?? initialValue ?? null;
      }
      // Si el item existe, intentar parsearlo como JSON
      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          // Si falla el parsing, es probablemente un string simple
          return item as StorageValue<T>;
        }
      }
      return initialValue ?? null;
    } catch (err) {
      console.error('Error al inicializar localStorage:', err);
      return initialValue ?? null;
    }
  });

  const [error, setError] = useState<Error | null>(null);
  const valueRef = useRef(value);

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(valueRef.current) : newValue;
        // Si es string, guarda directo
        if (typeof valueToStore === 'string') {
          localStorage.setItem(key, valueToStore);
        } else {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        valueRef.current = valueToStore;
        setValue(valueToStore);
        setError(null);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Error al guardar en localStorage');
        setError(error);
      }
    },
    [key]
  );

  const removeStoredValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      valueRef.current = initialValue;
      setValue(initialValue);
      setError(null);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Error al eliminar del localStorage');
      setError(error);
    }
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          if (typeof initialValue === 'string') {
            valueRef.current = e.newValue as unknown as T;
            setValue(e.newValue as unknown as T);
          } else {
            const newValue = e.newValue ? JSON.parse(e.newValue) : null;
            valueRef.current = newValue;
            setValue(newValue);
          }
        } catch (err) {
          console.error('Error al sincronizar localStorage:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    error,
  };
}

export default useLocalStorage;
