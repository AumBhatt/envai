import { useState, useEffect, useCallback } from 'react';
import type { ThermostatReading, UseApiHookReturn } from '../types/api';
import { API_BASE_URL } from '../config/api';

export const useLatestReading = (): UseApiHookReturn<ThermostatReading> => {
  const [data, setData] = useState<ThermostatReading | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestReading = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/data/latest`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch latest reading');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Latest reading fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchLatestReading();
  }, [fetchLatestReading]);

  useEffect(() => {
    fetchLatestReading();
  }, [fetchLatestReading]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
