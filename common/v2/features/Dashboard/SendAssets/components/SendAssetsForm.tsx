import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button, ComboBox, Heading, Input, Typography } from '@mycrypto/ui';

import { Transaction } from '../SendAssets';
import './SendAssetsForm.scss';

// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import { AccountContext, AssetOptionsContext } from 'v2/providers';
import { WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';
import { AddressField } from 'components';
import { RecipientAddressField } from '.';

interface Props {
  transaction: Transaction;
  onNext(): void;
  onSubmit(values: Transaction): void;
}

const QueryWarning: React.SFC<{}> = () => (
  <WhenQueryExists
    whenQueryExists={
      <div className="alert alert-info">
        <p>{translate('WARN_SEND_LINK')}</p>
      </div>
    }
  />
);

export default function SendAssetsForm({ transaction, onNext, onSubmit }: Props) {
  return (
    
    <Formik
      initialValues={transaction}
      onSubmit={values => {
        onSubmit(values);
        console.log('values: ' + JSON.stringify(values, null, 4))
        onNext();
      }}
      render={({ setFieldValue, values: { advancedMode }, handleChange }) => {
        const toggleAdvancedOptions = () => setFieldValue('advancedMode', !advancedMode);

        return (
          
          <Form className="SendAssetsForm">
            {/* Sender Address */}
            <QueryWarning />
            <fieldset className="SendAssetsForm-fieldset">
              <label htmlFor="senderAddress">Select an Existing Address</label>
              <AccountContext.Consumer>
                {({ accounts }) => {
                  const accountlist: string[] = []; 
                  accounts.map(en => {
                    accountlist.push(en.address);
                  })
                  return(
                    <Field
                      name="senderAddress"
                      id={'1'}
                      render={({ field }: FieldProps<Transaction>) => (
                        <ComboBox
                          {...field}
                          id={'2'}
                          onChange={handleChange}
                          value={field.value}
                          items={new Set(accountlist)}
                          className="SendAssetsForm-fieldset-input"
                        />
                      )}
                    />
                  )
                }}
              </AccountContext.Consumer>
            </fieldset>
            {/* Recipient Address */}
            
            <fieldset className="SendAssetsForm-fieldset">
            <Field
              id={'3'}
              name="recipientAddress"
              render={({ field, form }: FieldProps<Transaction>) => (
                <RecipientAddressField
                  {...field}
                  value={field.value}
                  placeholder="Enter an Address or Contact"
                  showLabelMatch={true}
                />
              )} />
            </fieldset>
            {/* Amount / Asset */}
            <div className="SendAssetsForm-fieldset SendAssetsForm-amountAsset">
              <div className="SendAssetsForm-amountAsset-amount">
                <label htmlFor="amount" className="SendAssetsForm-amountAsset-amount-label">
                  <div>Amount</div>
                  <div className="SendAssetsForm-amountAsset-amount-label-sendMax">send max</div>
                </label>
                
                      <Field
                        id={'5'}
                        name="amount"
                        render={({ field, form }: FieldProps<Transaction>) => (
                          <Input
                            {...field}
                            id={'6'}
                            value={field.value}
                            onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
                            placeholder="0.00"
                            className="SendAssetsForm-fieldset-input"
                          />
                        )}
                      />

              </div>
              <div className="SendAssetsForm-amountAsset-asset">
                <label htmlFor="asset">Asset</label>
                <AssetOptionsContext.Consumer>
                  {({ assetOptions = [] }) => {
                    const assetslist: string[] = []; 
                    assetOptions.map(en => {
                      assetslist.push(en.ticker);
                    })
                    return(
                      <Field
                        id={'7'}
                        name="asset"
                        render={({ field }: FieldProps<Transaction>) => (
                          <ComboBox
                            {...field}
                            id={'8'}
                            onChange={handleChange}
                            value={field.value}
                            items={new Set(assetslist)}
                            className="SendAssetsForm-fieldset-input"
                          />
                        )}
                      />
                    )
                  }}
                </AssetOptionsContext.Consumer>
              </div>
            </div>
            {/* You'll Send */}
            <fieldset className="SendAssetsForm-fieldset SendAssetsForm-fieldset-youllSend">
              <label>You'll Send</label>
              <div className="SendAssetsForm-fieldset-youllSend-box">
                <Heading as="h2" className="SendAssetsForm-fieldset-youllSend-box-crypto">
                  <img src={sendIcon} alt="Send" /> 13.233333 ETH
                </Heading>
                <small className="SendAssetsForm-fieldset-youllSend-box-fiat">≈ $1440.00 USD</small>
                <div className="SendAssetsForm-fieldset-youllSend-box-conversion">
                  <Typography>
                    Conversion Rate <br />
                    1 ETH ≈ $109.41 USD
                  </Typography>
                </div>
              </div>
            </fieldset>
            {/* Transaction Fee */}
            <fieldset className="SendAssetsForm-fieldset">
              <label htmlFor="transactionFee" className="SendAssetsForm-fieldset-transactionFee">
                <div>Transaction Fee</div>
                <div>0.000273 / $0.03 USD</div>
              </label>
              <div className="SendAssetsForm-fieldset-rangeWrapper">
                <div className="SendAssetsForm-fieldset-rangeWrapper-cheap" />
                <Field name="transactionFee" type="range" min="0" max="100" />
                <div className="SendAssetsForm-fieldset-rangeWrapper-fast" />
              </div>
              <div className="SendAssetsForm-fieldset-cheapFast">
                <div>Cheap</div>
                <div>Fast</div>
              </div>
            </fieldset>
            {/* Advanced Options */}
            <div className="SendAssetsForm-advancedOptions">
              <Button
                basic={true}
                onClick={toggleAdvancedOptions}
                className="SendAssetsForm-advancedOptions-button"
              >
                {advancedMode ? 'Hide' : 'Show'} Advanced Options
              </Button>
              {advancedMode && (
                <div className="SendAssetsForm-advancedOptions-content">
                  <div className="SendAssetsForm-advancedOptions-content-automaticallyCalculate">
                    <Field name="automaticallyCalculateGasLimit" type="checkbox" />
                    <label htmlFor="automaticallyCalculateGasLimit">
                      Automatically Calculate Gas Limit
                    </label>
                  </div>
                  <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce">
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-price">
                      <label htmlFor="gasPrice">Gas Price (gwei)</label>
                      <Field
                        name="gasPrice"
                        render={({ field, form }: FieldProps<Transaction>) => (
                          <Input
                            {...field}
                            value={field.value}
                            onChange={({ target: { value } }) =>
                              form.setFieldValue(field.name, value)
                            }
                            placeholder="0"
                            className="SendAssetsForm-fieldset-input"
                          />
                        )}
                      />
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-limit">
                      <label htmlFor="gasLimit">Gas Limit</label>
                      <Field
                        name="gasLimit"
                        render={({ field, form }: FieldProps<Transaction>) => (
                          <Input
                            {...field}
                            value={field.value}
                            onChange={({ target: { value } }) =>
                              form.setFieldValue(field.name, value)
                            }
                            placeholder="150000000"
                            className="SendAssetsForm-fieldset-input"
                          />
                        )}
                      />
                    </div>
                    <div className="SendAssetsForm-advancedOptions-content-priceLimitNonce-nonce">
                      <label htmlFor="nonce">Nonce (?)</label>
                      <Field
                        name="nonce"
                        render={({ field, form }: FieldProps<Transaction>) => (
                          <Input
                            {...field}
                            value={field.value}
                            onChange={({ target: { value } }) =>
                              form.setFieldValue(field.name, value)
                            }
                            placeholder="0"
                            className="SendAssetsForm-fieldset-input"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <fieldset className="SendAssetsForm-fieldset">
                    <label htmlFor="data">Data</label>
                    <Field
                      name="data"
                      render={({ field, form }: FieldProps<Transaction>) => (
                        <Input
                          {...field}
                          value={field.value}
                          onChange={({ target: { value } }) =>
                            form.setFieldValue(field.name, value)
                          }
                          placeholder="0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520"
                          className="SendAssetsForm-fieldset-input"
                        />
                      )}
                    />
                  </fieldset>
                  <div className="SendAssetsForm-advancedOptions-content-output">
                    0 + 13000000000 * 1500000 + 20000000000 * (180000 + 53000) = 0.02416 ETH ~=
                    $2.67 USD
                  </div>
                </div>
              )}
            </div>
            <Button type="submit" className="SendAssetsForm-next">
              Next
            </Button>
          </Form>
        );
      }}
    />
  );
}
