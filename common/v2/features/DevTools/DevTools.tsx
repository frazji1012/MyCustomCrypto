import React, { useContext } from 'react';
import { Formik, Field, Form, FieldProps } from 'formik';
import { Panel, Button, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { DEFAULT_NETWORK } from 'v2/config';
import { AccountContext, getLabelByAccount, AddressBookContext } from 'v2/services/Store';
import { useDevTools } from 'v2/services';
import { Account, AddressBook, ExtendedAccount, WalletId } from 'v2/types';

import ToolsNotifications from './ToolsNotifications';
import ToolsAccountList from './ToolsAccountList';

const DevToolsInput = styled(Input)`
  font-size: 1em;
`;

const DevTools = () => {
  const { addressBook } = useContext(AddressBookContext);
  return (
    <AccountContext.Consumer>
      {({ accounts, createAccount, deleteAccount }) => (
        <React.Fragment>
          <Panel style={{ marginBottom: 0, paddingTop: 50 }}>
            {/* Dashboard notifications */}
            <ToolsNotifications />

            {/* Accounts list */}
            <ToolsAccountList accounts={accounts} deleteAccount={deleteAccount} />

            {/* Form */}
            <>
              <div className="Settings-heading">Enter a new Account</div>
              <Formik
                initialValues={{
                  label: 'Foo',
                  address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
                  networkId: DEFAULT_NETWORK,
                  assets: [
                    {
                      uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a',
                      balance: '0',
                      mtime: Date.now()
                    }
                  ],
                  wallet: WalletId.METAMASK,
                  mtime: Date.now(),
                  transactions: [],
                  uuid: '61d84f5e-0efa-46b9-915c-aed6ebe5a4dc',
                  dPath: `m/44'/60'/0'/0/0`,
                  favorite: false
                }}
                onSubmit={(values: ExtendedAccount, { setSubmitting }) => {
                  createAccount(values);
                  setSubmitting(false);
                }}
              >
                {({ values, handleChange, handleBlur, isSubmitting }) => {
                  const detectedLabel: AddressBook | undefined = getLabelByAccount(
                    values,
                    addressBook
                  );
                  const label = detectedLabel ? detectedLabel.label : 'Unknown Account';
                  return (
                    <Form>
                      <fieldset>
                        Address:{' '}
                        <Field
                          name="address"
                          render={({ field }: FieldProps<Account>) => (
                            <DevToolsInput
                              {...field}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.address}
                            />
                          )}
                        />
                      </fieldset>
                      <br />
                      <fieldset>
                        Label:{' '}
                        <Field
                          name="label"
                          render={({ field }: FieldProps<Account>) => (
                            <DevToolsInput
                              {...field}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={label}
                            />
                          )}
                        />
                      </fieldset>
                      <br />
                      <fieldset>
                        Network:{' '}
                        <Field
                          name="network"
                          render={({ field }: FieldProps<Account>) => (
                            <DevToolsInput
                              {...field}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.networkId}
                            />
                          )}
                        />
                      </fieldset>
                      <br />
                      Current dev-mode only features
                      <ul>
                        <li>Recent Transactions panel (Dashboard)</li>
                        <li>Error page disabled</li>
                      </ul>
                      <Button type="submit" disabled={isSubmitting}>
                        Submit
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </>
          </Panel>
        </React.Fragment>
      )}
    </AccountContext.Consumer>
  );
};

const DevToolsToggle = () => {
  const { isActive, toggleDevTools } = useDevTools();
  return (
    <button
      onClick={toggleDevTools}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99,
        width: 112
      }}
    >
      {isActive ? 'DevMode On' : 'DevMode Off'}
    </button>
  );
};

const DevToolsManager = () => {
  const { isActive } = useDevTools();
  return (
    <div>
      <DevToolsToggle />
      {isActive && <DevTools />}
    </div>
  );
};

export { DevToolsManager };
