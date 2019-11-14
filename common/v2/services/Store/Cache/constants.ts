import { LocalCache } from 'v2/types';

// How long should fetches stay alive in cache?
export const CACHE_TIME_TO_LIVE = 1000 * 60 * 5;

// The name of the key in LocalStorage used for persistence.
export const LOCALSTORAGE_KEY = 'MyCryptoStorage';

export const ENCRYPTED_STORAGE_KEY = 'MyCryptoEncrypted';

export const CACHE_INIT: LocalCache = {
  // : LocalCache
  settings: {
    fiatCurrency: 'USD',
    darkMode: false,
    dashboardAccounts: [],
    inactivityTimer: 1800000,
    rates: {},
    language: 'en'
  },
  accounts: {},
  assets: {},
  networks: {},
  contracts: {},
  addressBook: {},
  notifications: {}
};
