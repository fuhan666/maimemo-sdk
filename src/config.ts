import { MaimemoOptions } from './types';

/**
 * 默认配置项
 */
export const DEFAULT_OPTIONS: MaimemoOptions = {
  baseUrl: 'https://open.maimemo.com/open',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
}; 