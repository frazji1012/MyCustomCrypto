import { TSymbol } from 'v2/types';

enum TickerBrand {}
export type TTicker = TickerBrand & string;

export interface IAsset {
  symbol: TSymbol;
  name: string;
  network?: string;
}

export type TAssetType = 'base' | 'erc20' | 'fiat';

export interface Asset {
  uuid: string;
  name: string;
  networkId?: string;
  ticker: string;
  symbol?: TSymbol;
  type: TAssetType;
  contractAddress?: string;
  decimal?: number;
}

export interface ExtendedAsset extends Asset {
  uuid: string;
}

// Used to reference an Asset in a storage Account
export interface AssetBalanceObject {
  uuid: string;
  balance: string;
  mtime: number;
}
