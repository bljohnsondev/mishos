import ky from 'ky';

import { UserDto } from '@/types';

export interface LoginResponse {
  user?: UserDto;
  token?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  return await ky
    .post(`${API_URL}/auth/login`, {
      json: { username, password },
    })
    .json();
};

export const getOnboardReady = async (): Promise<any | undefined> => {
  return await ky.get(`${API_URL}/auth/onboarding/ready`).json();
};

export const createInitialUser = async (username: string, password: string): Promise<LoginResponse> => {
  return await ky
    .post(`${API_URL}/auth/onboarding/create`, {
      json: { username, password },
    })
    .json();
};
