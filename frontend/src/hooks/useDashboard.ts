import { useState, useEffect, useCallback } from 'react';
import type { DashboardData, ApiResponse, UseApiHookReturn, ApiError } from '../types/api';
import { API_BASE_URL } from '../config/api';

export const useDashboard = (timeRange?: string): UseApiHookReturn<DashboardData> => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = timeRange 
        ? `${API_BASE_URL}/api/dashboard?timeRange=${timeRange}`
        : `${API_BASE_URL}/api/dashboard`;

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
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const refetch = useCallback(async () => {
    await fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
