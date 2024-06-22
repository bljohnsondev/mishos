import { createContext } from '@lit/context';

import type { AppStore } from '@/types';

export const appContext = createContext<AppStore>('appStore');
