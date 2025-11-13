import { useState, useEffect, useCallback } from 'react';
import type { TemperatureChartData, UseApiHookReturn } from '../types/api';
import { API_BASE_URL } from '../config/api';

export const useTemperatureChart = (timeRange?: string): UseApiHookReturn<TemperatureChartData> => {
  const [data, setData] = useState<TemperatureChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemperatureChart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = timeRange 
        ? `${API_BASE_URL}/api/charts/temperature?timeRange=${timeRange}`
        : `${API_BASE_URL}/api/charts/temperature`;

      const response = await fetch(url, {
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
        throw new Error(result.message || 'Failed to fetch temperature chart data');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Temperature chart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const refetch = useCallback(async () => {
    await fetchTemperatureChart();
  }, [fetchTemperatureChart]);

  useEffect(() => {
    fetchTemperatureChart();
  }, [fetchTemperatureChart]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
