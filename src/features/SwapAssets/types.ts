import { BigNumber } from 'bignumber.js';

import {
  ISwapAsset,
  ITxGasLimit,
  ITxGasPrice,
  ITxObject,
  ITxStatus,
  ITxType,
  NetworkId,
  StoreAccount
} from '@types';

export enum LAST_CHANGED_AMOUNT {
  FROM = 'FROM_AMOUNT',
  TO = 'TO_AMOUNT'
}

export interface TxEnveloppe {
  label: string;
  rawTx: ITxObject;
  txHash: string;
  status: ITxStatus;
  queuePos: number;
}

export interface SwapState {
  transactions: TxEnveloppe[];
  currentTxIndex: number;
  assetPair?: IAssetPair;
  account?: StoreAccount;
  isSubmitting: boolean;
  nextInFlow: boolean;
}

export interface SwapFormState {
  selectedNetwork: NetworkId;
  account: StoreAccount;
  assets: ISwapAsset[];
  fromAsset: ISwapAsset;
  fromAmount: string;
  toAsset: ISwapAsset;
  toAmount: string;
  fromAmountError?: string | JSX.Element;
  isCalculatingFromAmount: boolean;
  toAmountError?: string | JSX.Element;
  isCalculatingToAmount: boolean;
  isEstimatingGas: boolean;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  exchangeRate?: string; // The exchange rate displayed to the user
  isMulti: boolean;
  gasPrice?: ITxGasPrice;
  approvalGasLimit?: ITxGasLimit;
  tradeGasLimit?: ITxGasLimit;
  approvalTx?: Pick<ITxObject, 'to' | 'data' | 'value' | 'gasPrice' | 'chainId' | 'from'> & {
    type: ITxType;
  };
  expiration?: number;
  tradeTx?: Pick<ITxObject, 'to' | 'data' | 'value' | 'gasPrice' | 'chainId'> & { type: ITxType };
}

export interface IAssetPair {
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: BigNumber;
  toAmount: BigNumber;
  rate: BigNumber;
}

export type SwapDisplayData = Pick<IAssetPair, 'fromAsset' | 'toAsset' | 'fromAmount' | 'toAmount'>;
