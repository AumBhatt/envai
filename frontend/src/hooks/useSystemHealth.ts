import { useState, useEffect, useCallback } from 'react';
import type { SystemHealthData, UseApiHookReturn } from '../types/api';
import { API_BASE_URL } from '../config/api';

export const useSystemHealth = (): UseApiHookReturn<SystemHealthData> => {
  const [data, setData] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemHealth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/health`, {
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
        throw new Error(result.message || 'Failed to fetch system health data');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('System health fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchSystemHealth();
  }, [fetchSystemHealth]);

  useEffect(() => {
    fetchSystemHealth();
  }, [fetchSystemHealth]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
