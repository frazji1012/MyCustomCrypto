import { GasPriceSetting, DPathFormats } from 'types/network';

export interface NetworkOptions {
  contracts: string[];
  baseAsset: string;
  assets: string[];
  nodes: string[];
  id: string;
  name: string;
  unit: string;
  chainId: number;
  isCustom: boolean;
  color: string | undefined;
  blockExplorer: {};
  tokenExplorer: {};
  tokens: {};
  dPathFormats: DPathFormats;
  gasPriceSettings: GasPriceSetting;
  shouldEstimateGasPrice: boolean | undefined;
}

export interface ExtendedNetworkOptions extends NetworkOptions {
  uuid: string;
}
