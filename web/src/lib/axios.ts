import Axios from 'axios';

import { showError } from '@/components/notifications';
import { config } from '@/config';
import { useAppStore } from '@/stores';
import { storage } from '@/utils/storage';

export const axios = Axios.create({
  baseURL: config.apiUrl,
});

const setLoadingState = (loading: boolean) => {
  // only set the loading state if the user has been loaded - if not this gets into a recursive loop
  if (useAppStore.getState().user) {
    useAppStore.getState().setLoading(loading);
  }
};

axios.interceptors.request.use(config => {
  setLoadingState(true);
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = 'application/json';
  return config;
});

axios.interceptors.response.use(
  response => {
    setLoadingState(false);
    return response.data;
  },
  error => {
    setLoadingState(false);
    // dont show a notification for a 401 - let the code handle it
    if (error.response?.status !== 401) {
      const message = error.response?.data?.message || error.message;
      showError(message);
    }

    return Promise.reject(error);
  }
);
