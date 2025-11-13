import { useState, useEffect, useCallback } from 'react';
import type { GaugeChartData, UseApiHookReturn } from '../types/api';
import { API_BASE_URL } from '../config/api';

export const useGaugeChart = (timeRange?: string): UseApiHookReturn<GaugeChartData> => {
  const [data, setData] = useState<GaugeChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGaugeChart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = timeRange 
        ? `${API_BASE_URL}/api/charts/gauge?timeRange=${timeRange}`
        : `${API_BASE_URL}/api/charts/gauge`;

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
        throw new Error(result.message || 'Failed to fetch gauge chart data');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Gauge chart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const refetch = useCallback(async () => {
    await fetchGaugeChart();
  }, [fetchGaugeChart]);

  useEffect(() => {
    fetchGaugeChart();
  }, [fetchGaugeChart]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
