import { getCache } from '../LocalCache';
import { Asset, Network } from 'v2/types';
import { generateUUID } from 'v2/utils';

export const getAllAssets = () => {
  return Object.values(getCache().assets);
};

export const getAssetByTicker = (symbol: string): Asset | undefined => {
  const assets: Asset[] = getAllAssets();
  return assets.find(asset => asset.ticker.toLowerCase() === symbol.toLowerCase());
};

export const getNewDefaultAssetTemplateByNetwork = (network: Network): Asset => {
  const baseAssetOfNetwork: Asset | undefined = getAssetByTicker(network.id);
  if (!baseAssetOfNetwork) {
    return {
      uuid: generateUUID(),
      name: network.name,
      networkId: network.id,
      type: 'base',
      ticker: network.id,
      decimal: 18
    };
  } else {
    return {
      uuid: generateUUID(),
      name: baseAssetOfNetwork.name,
      networkId: baseAssetOfNetwork.networkId,
      type: 'base',
      ticker: baseAssetOfNetwork.ticker,
      decimal: baseAssetOfNetwork.decimal
    };
  }
};

export const getAssetByName = (name: string): Asset | undefined => {
  const allAssets = getAllAssets();
  return allAssets.find(asset => asset.name === name);
};

export const getAssetByUUID = (uuid: string): Asset | undefined => {
  const allAssets = getAllAssets();
  return allAssets.find(asset => asset.uuid === uuid);
};

export const getAssetByContractAndNetwork = (
  contractAddress: string | undefined,
  network: Network | undefined
): Asset | undefined => {
  if (!network || !contractAddress) {
    return undefined;
  }
  const allAssets = getAllAssets();
  return allAssets
    .filter(asset => asset.networkId && asset.contractAddress)
    .filter(asset => asset.networkId === network.id)
    .find(asset => asset.contractAddress === contractAddress);
};
