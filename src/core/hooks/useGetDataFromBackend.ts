import axios, { type AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toaster } from '../components/ui/toaster';
import { useAuth } from '../contexts/auth-context';

interface UseApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

interface UseApiRequestReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  callback: () => Promise<void>;
}

export function useGetDataFromBackend<T>({
  url,
  options,
  executeAutomatically = false,
  onSuccess,
  onError,
  timeout = 30000,
  pollingIntervalSeconds,
}: {
  url: string;
  options: UseApiRequestOptions;
  executeAutomatically?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  timeout?: number;
  pollingIntervalSeconds?: number;
}): UseApiRequestReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(executeAutomatically);
  const [error, setError] = useState<string | null>(null);
  const { role, token } = useAuth();

  const callback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        method: options.method || 'GET',
        url,
        data: options.body,
        timeout,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };
      const response: AxiosResponse<T> = await axios(config);
      setData(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      toaster.create({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options, role, onSuccess, onError, token]);

  useEffect(() => {
    if (executeAutomatically) {
      callback();
    }

    // Configurar polling si se especifica un intervalo
    let pollingInterval: NodeJS.Timeout | null = null;
    if (
      executeAutomatically &&
      pollingIntervalSeconds &&
      pollingIntervalSeconds > 0
    ) {
      pollingInterval = setInterval(() => {
        callback();
      }, pollingIntervalSeconds * 1000);
    }

    // Limpiar el intervalo al desmontar el componente
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [executeAutomatically]);

  return { data, loading, error, callback };
}
