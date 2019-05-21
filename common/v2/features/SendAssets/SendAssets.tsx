// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import React, { Component, ComponentType } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { isAdvancedQueryTransaction } from 'utils/helpers';
import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import { AssetOption, assetType } from 'v2/services/AssetOption/types';
import {
  createConfirmTransactionComponent,
  createSendAssetsForm,
  createTransactionReceipt,
  createSignTransaction
} from './components';
import { headings, steps } from './constants';

export interface TransactionFields {
  asset: string;
  senderAddress: string;
  recipientAddress: string;
  amount: string;
  data: string;
  gasLimitEstimated: string;
  gasPriceSlider: string;
  nonceEstimated: string;
  gasLimitField: string; // Use only if advanced tab is open AND isGasLimitManual is true
  gasPriceField: string; // Use only if advanced tab is open AND user has input gas price
  nonceField: string; // Use only if user has input a manual nonce value.
  isAdvancedTransaction: boolean; // Used to indicate whether transaction fee slider should be displayed and if Advanced Tab fields should be displayed.
  isGasLimitManual: boolean; // Used to indicate that user has un-clicked the user-input gas-limit checkbox.
}

export interface SendState {
  step: number;
  transactionFields: TransactionFields;

  isFetchingAccountValue: boolean; // Used to indicate looking up user's balance of currently-selected asset.
  isResolvingNSName: boolean; // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
  isAddressLabelValid: boolean; // Used to indicate if recipient-address is found in the address book.
  isFetchingAssetPricing: boolean; // Used to indicate fetching CC rates for currently-selected asset.
  isEstimatingGasLimit: boolean; // Used to indicate that gas limit is being estimated using `eth_estimateGas` jsonrpc call.

  resolvedNSAddress: string; // Address returned when attempting to resolve an ENS/RNS address.
  recipientAddressLabel: string; //  Recipient-address label found in address book.
  asset: AssetOption | undefined;
  network: string;
  assetType: assetType; // Type of asset selected. Directs how rawTransactionValues field are handled when formatting transaction.
}

const getInitialState = (): SendState => {
  return {
    step: 0,
    transactionFields: {
      senderAddress: '',
      recipientAddress: '',
      amount: '0',
      asset: 'ETH',
      gasPriceSlider: '20',
      gasPriceField: '20',
      gasLimitField: '21000',
      gasLimitEstimated: '21000',
      nonceEstimated: '0',
      nonceField: '0',
      data: '',
      isAdvancedTransaction: isAdvancedQueryTransaction(location.search) || false, // Used to indicate whether transaction fee slider should be displayed and if Advanced Tab fields should be displayed.
      isGasLimitManual: false
    },
    isFetchingAccountValue: false, // Used to indicate looking up user's balance of currently-selected asset.
    isResolvingNSName: false, // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
    isAddressLabelValid: false, // Used to indicate if recipient-address is found in the address book.
    isFetchingAssetPricing: false, // Used to indicate fetching CC rates for currently-selected asset.
    isEstimatingGasLimit: false, // Used to indicate that gas limit is being estimated using `eth_estimateGas` jsonrpc call.

    resolvedNSAddress: '', // Address returned when attempting to resolve an ENS/RNS address.
    recipientAddressLabel: '', //  Recipient-address label found in address book.
    asset: undefined,
    network: 'ETH',
    assetType: 'base' // Type of asset selected. Directs how rawTransactionValues field are handled when formatting transaction.
  };
};

export class SendAssets extends Component<RouteComponentProps<{}>> {
  public state: SendState = getInitialState();

  private sendAssetsSteps: ComponentType<{ stateValues: SendState }>[];

  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.sendAssetsSteps = [
      createSendAssetsForm({
        transactionFields: this.state.transactionFields,
        onNext: this.advanceStep,
        updateState: this.updateState,
        onSubmit: this.updateTransactionFields
      }),
      createConfirmTransactionComponent({ onNext: this.advanceStep }),
      createSignTransaction(),
      createTransactionReceipt({ onReset: this.handleReset })
    ];
  }

  public render() {
    const { history } = this.props;
    const { step } = this.state;
    const backOptions = [history.goBack, this.regressStep];
    // Step 3, ConfirmTransaction, cannot go back (as backOptions[2] is undefined)
    const onBack = backOptions[step];

    const Step = this.sendAssetsSteps[step];

    // const onBack = backOptions[step];
    // const Step = steps[step];
    return (
      <Layout className="SendAssets" centered={true}>
        <ContentPanel
          onBack={onBack}
          className="SendAssets-panel"
          heading={headings[step]}
          icon={sendIcon}
          stepper={{
            current: step + 1,
            total: steps.length
          }}
        >
          <Step stateValues={this.state} />
        </ContentPanel>
      </Layout>
    );
  }

  private advanceStep = () =>
    this.setState((prevState: SendState) => ({
      step: Math.min(prevState.step + 1, steps.length - 1)
    }));

  private regressStep = () =>
    this.setState((prevState: SendState) => ({
      step: Math.min(0, prevState.step - 1)
    }));

  private updateTransactionFields = (transactionFields: TransactionFields) => {
    this.setState({
      ...this.state,
      transactionFields
    });
  };

  private updateState = (state: SendState) => {
    this.setState({
      ...state
    });
  };

  private handleReset = () => this.setState(getInitialState());
}

export default withRouter(SendAssets);
