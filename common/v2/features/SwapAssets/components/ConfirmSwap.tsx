import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { SwapFromToDiagram, FromToAccount } from './fields';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from '../types';
import { StoreAccount } from 'v2/types';
import { COLORS } from 'v2/theme';
import { DexService } from 'v2/services/ApiService/Dex';

const { SILVER, BRIGHT_SKY_BLUE, GREY } = COLORS;

const StyledButton = styled(Button)`
  margin-top: 28px;
  width: 100%;
`;

const ConversionRateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${SILVER};
  font-size: 20px;
  font-weight: bold;
  height: 150px;
`;

const ConversionLabel = styled.div`
  color: ${GREY};
  font-weight: bold;
  font-size: 13px;
`;

const LinkLabel = styled.div`
  color: ${BRIGHT_SKY_BLUE};
  font-weight: normal;
  font-size: 13px;
  margin-bottom: 8px;
  text-align: right;
  cursor: pointer;
`;
interface Props {
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: string;
  toAmount: string;
  account: StoreAccount;
  swapPrice: number;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  setRawTransaction(tx: any): void;
  setDexTrade(trade: any): void;
  goToNextStep(): void;
  makeAllowanceTransaction(trade: any): Promise<string>;
  makeTradeTransactionFromDexTrade(trade: any): Promise<string>;
}

export default function ConfirmSwap(props: Props) {
  const {
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    account,
    setDexTrade,
    goToNextStep,
    setRawTransaction,
    makeAllowanceTransaction,
    makeTradeTransactionFromDexTrade,
    lastChangedAmount,
    swapPrice
  } = props;

  const isLastChangedTo = lastChangedAmount === LAST_CHANGED_AMOUNT.TO;

  const handleNextClicked = async () => {
    const getOrderDetails = isLastChangedTo
      ? DexService.instance.getOrderDetailsTo
      : DexService.instance.getOrderDetailsFrom;

    const trade = await getOrderDetails(
      fromAsset.symbol,
      toAsset.symbol,
      isLastChangedTo ? toAmount : fromAmount
    );

    setDexTrade(trade);

    const makeTransaction = trade.metadata.input
      ? makeAllowanceTransaction
      : makeTradeTransactionFromDexTrade;
    const rawTransaction = await makeTransaction(trade);
    setRawTransaction(rawTransaction);

    goToNextStep();
  };

  const conversionRate = lastChangedAmount === LAST_CHANGED_AMOUNT.TO ? 1 / swapPrice : swapPrice;

  return (
    <div>
      <SwapFromToDiagram
        fromSymbol={fromAsset.symbol}
        toSymbol={toAsset.symbol}
        fromAmount={fromAmount}
        toAmount={toAmount}
      />
      <FromToAccount fromAccount={account} toAccount={account} />
      <LinkLabel>why this rate?</LinkLabel>
      <ConversionRateBox>
        <ConversionLabel>Conversion Rate</ConversionLabel>
        {`1 ${fromAsset.symbol} ≈ ${conversionRate} ${toAsset.symbol}`}
      </ConversionRateBox>
      <StyledButton onClick={handleNextClicked}>Confirm and Send</StyledButton>
    </div>
  );
}
