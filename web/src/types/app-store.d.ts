import type { InitData } from './init-data';

export interface AppStore {
  loading?: boolean;
  initData?: InitData;
}
