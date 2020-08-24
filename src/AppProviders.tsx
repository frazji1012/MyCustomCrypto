import React from 'react';

import { NotificationsProvider, ToastProvider, ErrorProvider } from '@features';
import {
  AccountProvider,
  AddressBookProvider,
  SettingsProvider,
  DataProvider
} from '@services/Store';

import { DevToolsProvider, RatesProvider, StoreProvider, FeatureFlagProvider } from '@services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <FeatureFlagProvider>
      <DevToolsProvider>
        <ErrorProvider>
          <DataProvider>
            <SettingsProvider>
              <AccountProvider>
                <NotificationsProvider>
                  <ToastProvider>
                    <AddressBookProvider>
                      {/* StoreProvider relies on the others Providers */}
                      <StoreProvider>
                        {/* RatesProvider relies on the Store */}
                        <RatesProvider>{children}</RatesProvider>
                      </StoreProvider>
                    </AddressBookProvider>
                  </ToastProvider>
                </NotificationsProvider>
              </AccountProvider>
            </SettingsProvider>
          </DataProvider>
        </ErrorProvider>
      </DevToolsProvider>
    </FeatureFlagProvider>
  );
}

export default AppProviders;
