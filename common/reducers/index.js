// @flow
import * as generateWallet from './generateWallet';
import type { State as GenerateWalletState } from './generateWallet';

import * as config from './config';
import type { State as ConfigState } from './config';

import * as swap from './swap';

import * as notifications from './notifications';
import type { State as NotificationsState } from './notifications';

import * as ens from './ens';
import type { State as EnsState } from './ens';

import * as wallet from './wallet';
import type { State as WalletState } from './wallet';

import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export type State = {
  generateWallet: GenerateWalletState,
  config: ConfigState,
  notifications: NotificationsState,
  ens: EnsState,
  wallet: WalletState
};

export default combineReducers({
  ...generateWallet,
  ...config,
  ...swap,
  ...notifications,
  ...ens,
  ...wallet,
  form: formReducer,
  routing: routerReducer
});
