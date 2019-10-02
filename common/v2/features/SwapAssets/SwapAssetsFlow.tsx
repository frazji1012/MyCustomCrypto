import React, { useState, ReactType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import {
  SwapAssets,
  SelectAddress,
  ConfirmSwap,
  WaitingDeposit,
  SwapTransactionReceipt
} from './components';
import { ROUTE_PATHS } from 'v2/config';
import { ISwapAsset } from './types';
import { TSymbol } from 'v2/types';

interface TStep {
  title: string;
  description?: string;
  component: ReactType;
}

const BroadcastTransactionFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const [asset, setAsset] = useState<ISwapAsset>();
  const [receiveAsset, setReceiveAsset] = useState<ISwapAsset>(dummyAssets[4]);
  const [sendAmount, setSendAmount] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const [sendAddress, setSendAddress] = useState();
  const [receiveAddress, setReceiveAddress] = useState();
  const [sendAddressManuallySelected, setSendAddressManuallySelected] = useState(true);
  const [receiveAddressManuallySelected, setReceiveAddressManuallySelected] = useState(true);

  const steps: TStep[] = [
    {
      title: 'Swap Assets',
      description: 'How much do you want to send and receive?',
      component: SwapAssets
    },
    {
      title: 'Select Addresses',
      description: `Where will you be sending ${asset &&
        asset.symbol} from? Where would you like to receive your ${receiveAsset &&
        receiveAsset.symbol}?`,
      component: SelectAddress
    },
    {
      title: 'Confirm Swap',
      component: ConfirmSwap
    },
    {
      title: 'Waiting on Deposit',
      component: WaitingDeposit
    },
    {
      title: 'Transaction Receipt',
      component: SwapTransactionReceipt
    }
  ];

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    const { history } = props;
    if (step === 0) {
      history.push(ROUTE_PATHS.DASHBOARD.path);
    } else {
      setStep(step - 1);
    }
  };

  const stepObject = steps[step];
  const StepComponent = stepObject.component;

  return (
    <ExtendedContentPanel
      onBack={goToPreviousStep}
      stepper={{ current: step + 1, total: steps.length }}
      width="650px"
      heading={stepObject.title}
      description={stepObject.description}
    >
      <StepComponent
        goToNextStep={goToNextStep}
        setStep={setStep}
        setAsset={setAsset}
        setReceiveAsset={setReceiveAsset}
        setSendAmount={setSendAmount}
        setReceiveAmount={setReceiveAmount}
        sendAmount={sendAmount}
        receiveAmount={receiveAmount}
        assets={dummyAssets}
        asset={asset}
        receiveAsset={receiveAsset}
        sendAddressManuallySelected={sendAddressManuallySelected}
        setSendAddressManuallySelected={setSendAddressManuallySelected}
        receiveAddressManuallySelected={receiveAddressManuallySelected}
        setReceiveAddressManuallySelected={setReceiveAddressManuallySelected}
        sendAddress={sendAddress}
        setSendAddress={setSendAddress}
        receiveAddress={receiveAddress}
        setReceiveAddress={setReceiveAddress}
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(BroadcastTransactionFlow);

const dummyAssets: ISwapAsset[] = [
  { name: 'ETH ', symbol: 'ETH' as TSymbol },
  { name: 'Dai (DAI)', symbol: 'DAI' as TSymbol },
  { name: 'Maker (MKR)', symbol: 'MKR' as TSymbol },
  { name: 'USD Coin (USDC)', symbol: 'USDC' as TSymbol },
  { name: 'Basic Attention Token (BAT)', symbol: 'BAT' as TSymbol },
  { name: 'Wrapped Bitcoin (WBTC)', symbol: 'WBTC' as TSymbol },
  { name: 'Chainlink (LINK)', symbol: 'LINK' as TSymbol },
  { name: 'Augur (REP)', symbol: 'REP' as TSymbol },
  { name: '0x (ZRX)', symbol: 'ZRX' as TSymbol },
  { name: 'Kyber Network (KNC)', symbol: 'KNC' as TSymbol },
  { name: 'sUSD (SUSD)', symbol: 'SUSD' as TSymbol },
  { name: 'Synthetix Network Token (SNX)', symbol: 'SNX' as TSymbol },
  { name: 'Zilliqa (ZIL)', symbol: 'ZIL' as TSymbol },
  { name: 'cDAI (cDAI)', symbol: 'CDAI' as TSymbol },
  { name: 'Status (SNT)', symbol: 'SNT' as TSymbol },
  { name: 'Loom Network (LOOM)', symbol: 'LOOM' as TSymbol },
  { name: 'OmiseGO (OMG)', symbol: 'OMG' as TSymbol },
  { name: 'Grid+ (GRID)', symbol: 'GRID' as TSymbol },
  { name: 'Enjin (ENJ)', symbol: 'ENJ' as TSymbol },
  { name: 'Golem (GNT)', symbol: 'GNT' as TSymbol },
  { name: 'Gnosis (GNO)', symbol: 'GNO' as TSymbol },
  { name: 'Bancor (BNT)', symbol: 'BNT' as TSymbol },
  { name: 'USDT (USDT)', symbol: 'USDT' as TSymbol },
  { name: 'TrueUSD (TUSD)', symbol: 'TUSD' as TSymbol },
  { name: 'Decentraland (MANA)', symbol: 'MANA' as TSymbol },
  { name: 'district0x (DNT)', symbol: 'DNT' as TSymbol },
  { name: 'Aragon (ANT)', symbol: 'ANT' as TSymbol },
  { name: 'Fulcrum iDAI (iDAI)', symbol: 'IDAI' as TSymbol },
  { name: 'Melon (MLN)', symbol: 'MLN' as TSymbol },
  { name: 'SpankChain (SPANK)', symbol: 'SPANK' as TSymbol },
  { name: 'QASH (QASH)', symbol: 'QASH' as TSymbol },
  { name: 'Ontology Gas (ONG)', symbol: 'ONG' as TSymbol },
  { name: 'Loopring (LRC)', symbol: 'LRC' as TSymbol },
  { name: 'Huobi Token (HT)', symbol: 'HT' as TSymbol },
  { name: 'Waltonchain (WTC)', symbol: 'WTC' as TSymbol },
  { name: 'Bee Token (BEE)', symbol: 'BEE' as TSymbol },
  { name: 'Crypto.com (MCO)', symbol: 'MCO' as TSymbol },
  { name: 'Nexo (NEXO)', symbol: 'NEXO' as TSymbol },
  { name: 'Raiden Network Token (RDN)', symbol: 'RDN' as TSymbol },
  { name: 'TokenCard (TKN)', symbol: 'TKN' as TSymbol },
  { name: 'AMPL (AMPL)', symbol: 'AMPL' as TSymbol },
  { name: 'FOAM (FOAM)', symbol: 'FOAM' as TSymbol },
  { name: 'Ren (REN)', symbol: 'REN' as TSymbol },
  { name: 'WAX (WAX)', symbol: 'WAX' as TSymbol },
  { name: 'Storj (STORJ)', symbol: 'STORJ' as TSymbol },
  { name: 'Polymath (POLY)', symbol: 'POLY' as TSymbol },
  { name: 'Bloom (BLT)', symbol: 'BLT' as TSymbol },
  { name: 'iExec RLC (RLC)', symbol: 'RLC' as TSymbol },
  { name: 'QuarkChain (QKC)', symbol: 'QKC' as TSymbol },
  { name: 'Santiment Network Token (SAN)', symbol: 'SAN' as TSymbol },
  { name: 'Enigma (ENG)', symbol: 'ENG' as TSymbol },
  { name: 'SingularityNET (AGI)', symbol: 'AGI' as TSymbol },
  { name: 'FunFair (FUN)', symbol: 'FUN' as TSymbol },
  { name: 'Ripio (RCN)', symbol: 'RCN' as TSymbol },
  { name: 'Civic (CVC)', symbol: 'CVC' as TSymbol },
  { name: 'Power Ledger (POWR)', symbol: 'POWR' as TSymbol },
  { name: 'Eidoo (EDO)', symbol: 'EDO' as TSymbol },
  { name: 'IoTeX (IOTX)', symbol: 'IOTX' as TSymbol },
  { name: 'Live Peer (LPT)', symbol: 'LPT' as TSymbol },
  { name: 'Aelf (ELF)', symbol: 'ELF' as TSymbol },
  { name: 'Pax (PAX)', symbol: 'PAX' as TSymbol },
  { name: 'Numeraire (NMR)', symbol: 'NMR' as TSymbol }
];
