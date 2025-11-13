import { useState, useEffect, useCallback } from 'react';
import type { HeatmapChartData, UseApiHookReturn } from '../types/api';
import { API_BASE_URL } from '../config/api';

export const useHeatmapChart = (timeRange?: string): UseApiHookReturn<HeatmapChartData> => {
  const [data, setData] = useState<HeatmapChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeatmapChart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = timeRange 
        ? `${API_BASE_URL}/api/charts/heatmap?timeRange=${timeRange}`
        : `${API_BASE_URL}/api/charts/heatmap`;

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
        throw new Error(result.message || 'Failed to fetch heatmap chart data');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Heatmap chart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const refetch = useCallback(async () => {
    await fetchHeatmapChart();
  }, [fetchHeatmapChart]);

  useEffect(() => {
    fetchHeatmapChart();
  }, [fetchHeatmapChart]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
