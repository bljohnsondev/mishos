import { createContext } from '@lit/context';

import { AppStore } from '@/types';

export const appContext = createContext<AppStore>('appStore');
