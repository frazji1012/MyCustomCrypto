import React, { createContext, useContext, useState, useEffect } from 'react';

import { StoreContext } from 'v2/services/Store';
import { PollingService } from 'v2/workers';
import { IRates, TTicker, StoreAsset } from 'v2/types';

interface State {
  rates: IRates;
  getRate(ticker: TTicker): number | undefined;
}

const DEFAULT_FIAT_PAIRS = ['USD', 'EUR'] as TTicker[];
const DEFAULT_FIAT_RATE = 0;
const POLLING_INTERRVAL = 60000;
const RATES_URL = 'https://proxy.mycryptoapi.com/cc/multi';
const buildQueryUrl = (assets: TTicker[], currencies: TTicker[]) => `
  ${RATES_URL}/?fsyms=${assets.join(',')}&tsyms=${currencies.join(',')}
`;

// The cryptocompare api that our proxie uses fails gracefully and will return a conversion rate
// even if some are tickers are invalid (e.g WETH, GoerliETH etc.)
// @TODO: figure out how to handle the conversion more elegantly then `DEFAULT_FIAT_RATE`
const getAssetTickers = (assets: StoreAsset[]): TTicker[] => assets.map(a => a.ticker as TTicker);

export const RatesContext = createContext({} as State);

export function RatesProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = useState({});
  const { accounts, assets } = useContext(StoreContext);

  useEffect(() => {
    const currentAssets = assets();
    const currentTickers = getAssetTickers(currentAssets);
    const worker = new PollingService(
      buildQueryUrl(currentTickers, DEFAULT_FIAT_PAIRS),
      POLLING_INTERRVAL,
      (data: IRates) => setRates(data),
      err => console.debug('[RatesProvider]', err)
    );

    const terminateWorker = () => {
      worker.stop();
      worker.close();
    };

    worker.start();
    return terminateWorker; // make sure we terminate the previous worker on teardown.
  }, [accounts]); // only update  if accounts have changed.

  const state: State = {
    rates: {},
    getRate: (ticker: TTicker) => {
      // @ts-ignore until we find a solution for TS7053 error
      return rates[ticker] ? rates[ticker].USD : DEFAULT_FIAT_RATE;
    }
  };

  return <RatesContext.Provider value={state}>{children}</RatesContext.Provider>;
}
