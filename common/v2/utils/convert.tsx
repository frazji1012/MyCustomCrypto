import { bigNumberify, formatEther, BigNumber } from 'ethers/utils';

export const convertToFiat = (balance: BigNumber, rate: number = 1): number => {
  const splitRate = rate.toString().split('.');
  const decimals = splitRate.length > 1 ? splitRate[1].length : 0;
  const rateDivisor = Math.pow(10, decimals);
  const rateBN = bigNumberify(Math.round(rate * rateDivisor));

  const convertedFloat = parseFloat(formatEther(balance.mul(rateBN)));
  return convertedFloat / rateDivisor;
};

export const weiToFloat = (wei: BigNumber): number => parseFloat(formatEther(wei));
