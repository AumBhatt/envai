import { useState, useEffect, useCallback } from 'react';
import type { EnergyChartData, UseApiHookReturn } from '../types/api';
import { API_BASE_URL } from '../config/api';

export const useEnergyChart = (timeRange?: string): UseApiHookReturn<EnergyChartData> => {
  const [data, setData] = useState<EnergyChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnergyChart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = timeRange 
        ? `${API_BASE_URL}/api/charts/weekly-costs?timeRange=${timeRange}`
        : `${API_BASE_URL}/api/charts/weekly-costs`;

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
        throw new Error(result.message || 'Failed to fetch energy chart data');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Energy chart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const refetch = useCallback(async () => {
    await fetchEnergyChart();
  }, [fetchEnergyChart]);

  useEffect(() => {
    fetchEnergyChart();
  }, [fetchEnergyChart]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
