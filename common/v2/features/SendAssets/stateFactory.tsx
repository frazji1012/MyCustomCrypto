import {
  TUseApiFactory,
  getNetworkByChainId,
  getAssetByContractAndNetwork,
  decodeTransfer,
  toWei,
  fromTokenBase,
  getDecimalFromEtherUnit,
  gasPriceToBase,
  hexWeiToString
} from 'v2/services';
import { ProviderHandler } from 'v2/config';
import { getAccountByAddressAndNetworkName } from 'v2/services/Store/Account';

import { ITxConfig, ITxReceipt, IFormikFields, TStepAction, ISignedTx, ITxObject } from './types';
import { processFormDataToTx, decodeTransaction, fromTxReceiptObj } from './helpers';

const txConfigInitialState = {
  tx: {
    gasLimit: null,
    gasPrice: null,
    nonce: null,
    data: null,
    to: null
  },
  amount: null,
  receiverAddress: null,
  senderAccount: null,
  network: undefined,
  asset: null
};

interface State {
  txConfig: ITxConfig;
  signedTx?: ISignedTx;
  txReceipt?: ITxReceipt;
}

const TxConfigFactory: TUseApiFactory<State> = ({ state, setState }) => {
  const handleFormSubmit: TStepAction = (payload: IFormikFields, after) => {
    const rawTransaction: ITxObject = processFormDataToTx(payload);
    setState((prevState: State) => ({
      ...prevState,
      txConfig: {
        rawTransaction,
        amount: payload.amount,
        senderAccount: payload.account,
        receiverAddress: payload.receiverAddress,
        network: payload.network,
        asset: payload.asset,
        from: payload.account.address,
        gasPrice: hexWeiToString(rawTransaction.gasPrice),
        gasLimit: payload.gasLimitField,
        nonce: payload.nonceField,
        data: rawTransaction.data,
        value: hexWeiToString(rawTransaction.value)
      }
    }));

    after();
  };

  // For Metamask
  const handleConfirmAndSign: TStepAction = (payload: ITxConfig, after) => {
    setState((prevState: State) => ({
      ...prevState,
      txReceipt: payload
    }));

    after();
  };

  // For Other Wallets
  // tslint:disable-next-line
  const handleConfirmAndSend: TStepAction = (_payload, after) => {
    const provider = new ProviderHandler(state.txConfig.network);
    if (state.signedTx) {
      provider
        .sendRawTx(state.signedTx)
        .then(transactionReceipt => {
          setState((prevState: State) => ({
            ...prevState,
            txReceipt: transactionReceipt
          }));
          after();
        })
        .catch(txHash => {
          // If rejected, data is a tx hash, not a receipt. Fetch the receipt, then save receipt for flow
          provider.getTransactionByHash(txHash).then(transactionReceipt => {
            setState((prevState: State) => ({
              ...prevState,
              txReceipt: transactionReceipt
            }));
            after();
          });
        });
    }
  };

  const handleSignedTx: TStepAction = (payload: ISignedTx, after) => {
    const decodedTx = decodeTransaction(payload);
    const networkDetected = getNetworkByChainId(decodedTx.chainId);
    const contractAsset = getAssetByContractAndNetwork(decodedTx.to || undefined, networkDetected);
    setState((prevState: State) => ({
      ...prevState,
      signedTx: payload,
      txConfig: {
        rawTransaction: prevState.txConfig.rawTransaction,
        receiverAddress: contractAsset ? decodeTransfer(decodedTx.data)._to : decodedTx.to,
        amount: contractAsset
          ? fromTokenBase(
              toWei(decodeTransfer(decodedTx.data)._value, 0),
              contractAsset.decimal || 18
            )
          : decodedTx.value,
        network: networkDetected || state.txConfig.network,
        value: toWei(decodedTx.value, getDecimalFromEtherUnit('ether')).toString(),
        asset: contractAsset || state.txConfig.asset,
        senderAccount:
          decodedTx.from && networkDetected
            ? getAccountByAddressAndNetworkName(decodedTx.from, networkDetected.name) ||
              state.txConfig.senderAccount
            : state.txConfig.senderAccount,
        gasPrice: gasPriceToBase(parseInt(decodedTx.gasPrice, 10)).toString(),
        gasLimit: decodedTx.gasLimit,
        data: decodedTx.data,
        nonce: decodedTx.nonce.toString(),
        from: decodedTx.from || state.txConfig.from
      }
    }));

    after();
  };

  const handleSignedWeb3Tx: TStepAction = (payload: ITxReceipt, after) => {
    setState((prevState: State) => ({
      ...prevState,
      txReceipt: fromTxReceiptObj(payload)
    }));
    after();
  };

  return {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    handleSignedWeb3Tx,
    txConfig: state.txConfig,
    txReceipt: state.txReceipt,
    signedTx: state.signedTx
  };
};

export { txConfigInitialState, TxConfigFactory };
