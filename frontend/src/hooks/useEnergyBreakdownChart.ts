import { useState, useEffect, useCallback } from 'react';
import type { EnergyBreakdownChartData, UseApiHookReturn } from '../types/api';
import { API_BASE_URL } from '../config/api';

export const useEnergyBreakdownChart = (timeRange?: string): UseApiHookReturn<EnergyBreakdownChartData> => {
  const [data, setData] = useState<EnergyBreakdownChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnergyBreakdownChart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = timeRange 
        ? `${API_BASE_URL}/api/charts/energy-breakdown?timeRange=${timeRange}`
        : `${API_BASE_URL}/api/charts/energy-breakdown`;

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
        throw new Error(result.message || 'Failed to fetch energy breakdown chart data');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Energy breakdown chart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const refetch = useCallback(async () => {
    await fetchEnergyBreakdownChart();
  }, [fetchEnergyBreakdownChart]);

  useEffect(() => {
    fetchEnergyBreakdownChart();
  }, [fetchEnergyBreakdownChart]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
