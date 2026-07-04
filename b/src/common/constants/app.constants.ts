export const APP_CONSTANTS = {
  API_PREFIX: 'api',
  API_VERSION: '1',
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const CACHE_KEYS = {
  USER_PREFIX: 'user:',
  ROLE_PREFIX: 'role:',
} as const;

export const QUEUE_NAMES = {
  EMAIL: 'email',
} as const;
