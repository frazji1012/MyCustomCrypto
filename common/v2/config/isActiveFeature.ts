import { IS_DEV } from '@utils';

export enum FEATURE_LIST {
  DASHBOARD = 'DASHBOARD',
  BUY = 'BUY',
  SEND_ASSETS = 'SEND_ASSETS',
  BROADCAST_TX = 'BROADCAST_TX',
  ADD_ACCOUNT = 'ADD_ACCOUNT',
  CONTRACT_INTERACT = 'CONTRACT_INTERACT',
  CONTRACT_DEPLOY = 'CONTRACT_DEPLOY',
  SIGN_MESSAGE = 'SIGN_MESSAGE',
  VERIFY_MESSAGE = 'VERIFY_MESSAGE',
  TX_HISTORY = 'TX_HISTORY',
  REQUEST_ASSETS = 'REQUEST_ASSETS',
  CREATE_WALLET = 'CREATE_WALLET',
  SCREEN_LOCK = 'SCREEN_LOCK',
  SETTINGS = 'SETTINGS',
  SWAP = 'SWAP',
  DOWNLOAD_DESKTOP_APP = 'DOWNLOAD_DESKTOP_APP',
  PRIVATE_TAGS = 'PRIVATE_TAGS',
  DEFIZAP = 'DEFIZAP',
  MYC_MEMBERSHIP = 'MYC_MEMBERSHIP',
  PROTECT_TX = 'PROTECT_TX'
}

export type IIS_ACTIVE_FEATURE = {
  readonly [k in FEATURE_LIST]: boolean;
};

export const IS_ACTIVE_FEATURE: IIS_ACTIVE_FEATURE = {
  DASHBOARD: true,
  BUY: true,
  SEND_ASSETS: true,
  BROADCAST_TX: true,
  ADD_ACCOUNT: true,
  CONTRACT_INTERACT: true,
  CONTRACT_DEPLOY: true,
  SIGN_MESSAGE: true,
  VERIFY_MESSAGE: true,
  TX_HISTORY: true,
  REQUEST_ASSETS: true,
  CREATE_WALLET: true,
  SCREEN_LOCK: true,
  SETTINGS: true,
  SWAP: true,
  DOWNLOAD_DESKTOP_APP: true,
  PRIVATE_TAGS: true,
  DEFIZAP: true,
  MYC_MEMBERSHIP: IS_DEV,
  PROTECT_TX: IS_DEV
};
