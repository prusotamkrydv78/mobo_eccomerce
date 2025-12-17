import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../lib/axios';
import toast from 'react-hot-toast';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(url);
      setData(response.data);
    } catch (err) {
      setError(err);
      if (options.showError !== false) {
        toast.error(err.response?.data?.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, [fetchData, options.immediate]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useMutation = (baseUrl, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (data, method = 'post', url = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const targetUrl = url || `${baseUrl}/${data}`;
      
      let response;
      if (method === 'post') {
        response = await axiosInstance.post(baseUrl, data);
      } else if (method === 'put') {
        response = await axiosInstance.put(targetUrl, data);
      } else if (method === 'patch') {
        response = await axiosInstance.patch(targetUrl, data);
      } else if (method === 'delete') {
        response = await axiosInstance.delete(targetUrl);
      }

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      if (options.showSuccessMessage !== false) {
        toast.success(options.successMessage || 'Operation successful');
      }

      return response.data;
    } catch (err) {
      setError(err);
      if (options.showError !== false) {
        toast.error(err.response?.data?.message || 'Operation failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  return { mutate, loading, error };
};
