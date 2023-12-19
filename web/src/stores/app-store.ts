import { create } from 'zustand';

import { UserDto } from '@/types';

type ColorScheme = 'light' | 'dark';

interface AppStore {
  user?: UserDto | null;
  loading?: boolean;
  setUser: (newUser: UserDto | null) => void;
  setLoading: (newLoading: boolean) => void;
  removeUser: () => void;
  colorScheme?: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const useAppStore = create<AppStore>(set => ({
  setUser: newUser =>
    set(() => ({
      user: newUser,
    })),
  setLoading: newLoading => set(() => ({ loading: newLoading })),
  removeUser: () => set(() => ({ user: undefined })),
  setColorScheme: (scheme: ColorScheme) => set(() => ({ colorScheme: scheme })),
}));
