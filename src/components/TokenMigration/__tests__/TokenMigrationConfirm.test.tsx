import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { REPV1UUID } from '@config';
import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccounts, fAssets, fNetwork, fSettings, fTokenMigrationTxs } from '@fixtures';
import { FeatureFlagProvider, RatesContext } from '@services';
import { DataContext, StoreContext } from '@services/Store';
import { StoreAccount } from '@types';

import ConfirmTokenMigration from '../components/TokenMigrationConfirm';
import { TokenMigrationMultiTxConfirmProps } from '../components/TokenMigrationMultiTx';

const defaultProps: TokenMigrationMultiTxConfirmProps & {
  amount: string;
  account: StoreAccount;
} = {
  tokenMigrationConfig: repTokenMigrationConfig,
  currentTxIdx: 0,
  amount: '1',
  account: fAccounts[0],
  transactions: fTokenMigrationTxs(),
  onComplete: jest.fn()
};

function getComponent(props: TokenMigrationMultiTxConfirmProps) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            addressBook: [],
            contracts: [],
            assets: [{ uuid: fNetwork.baseAsset }],
            settings: fSettings,
            networks: [fNetwork],
            userActions: [],
            createActions: jest.fn()
          } as unknown) as any
        }
      >
        <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
          <FeatureFlagProvider>
            <StoreContext.Provider
              value={
                ({
                  userAssets: [],
                  accounts: [],
                  defaultAccount: { assets: [] },
                  getAccount: jest.fn(),
                  networks: [{ nodes: [] }]
                } as unknown) as any
              }
            >
              <ConfirmTokenMigration {...((props as unknown) as any)} />
            </StoreContext.Provider>
          </FeatureFlagProvider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </MemoryRouter>
  );
}

/* Test components */
describe('TokenMigrationConfirm', () => {
  test('Can render the TokenMigration confirm panel', () => {
    const { getAllByText } = getComponent(defaultProps);
    const asset = fAssets.find(({ uuid }) => uuid === REPV1UUID)!;
    expect(getAllByText(asset.ticker, { exact: false })).toBeDefined();
  });
});
