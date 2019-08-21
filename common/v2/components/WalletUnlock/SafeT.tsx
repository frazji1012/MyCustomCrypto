import React, { PureComponent } from 'react';

import { FormData } from 'v2/features/AddAccount/types';
import { NetworkContext } from 'v2/services/Store';
import { getDPath, getDPaths } from 'v2/services';
import { SecureWalletName } from 'v2/types';
import translate, { translateRaw } from 'translations';
import { SafeTWallet } from 'libs/wallet';
import { Spinner } from 'components/ui';
import UnsupportedNetwork from './UnsupportedNetwork';
import DeterministicWallets from './DeterministicWallets';
import './SafeT.scss';
import SafeTIcon from 'common/assets/images/icn-safet-mini-new.svg';

//todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

// todo: nearly duplicates ledger component props
interface State {
  publicKey: string;
  chainCode: string;
  dPath: DPath;
  error: string | null;
  isLoading: boolean;
}

type Props = OwnProps;

class SafeTminiDecryptClass extends PureComponent<Props, State> {
  public static contextType = NetworkContext;
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath:
      getDPath(
        this.context.getNetworkByName(this.props.formData.network),
        SecureWalletName.SAFE_T
      ) || getDPaths(this.context.networks, SecureWalletName.SAFE_T)[0],
    error: null,
    isLoading: false
  };

  public render() {
    const { dPath, publicKey, chainCode, error, isLoading } = this.state;
    const showErr = error ? 'is-showing' : '';
    const networks = this.context.networks;
    const network = this.context.getNetworkByName(this.props.formData.network);

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('X_SAFE_T')} />;
    }

    if (publicKey && chainCode) {
      return (
        <div className="Mnemonic-dpath">
          <DeterministicWallets
            network={network}
            publicKey={publicKey}
            chainCode={chainCode}
            dPath={dPath}
            dPaths={getDPaths(networks, SecureWalletName.SAFE_T)}
            onCancel={this.handleCancel}
            onConfirmAddress={this.handleUnlock}
            onPathChange={this.handlePathChange}
          />
        </div>
      );
    } else {
      // todo: update help link
      return (
        <div className="Panel">
          <div className="Panel-title">
            {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_SAFE_T')}`}
          </div>
          <div className="SafeTminiDecrypt">
            <div className="SafeTminiDecrypt-description">
              {translate('SAFET_MINI_DESCRIPTION')}
            </div>
            <div className="SafeTminiDecrypt-img">
              <img src={SafeTIcon} />
            </div>
            <div className="SafeTMini-button-container">
              <div className="SafeTminiDecrypt-unlockButton">
                {isLoading ? (
                  <div className="SafeTminiDecrypt-message">
                    <Spinner />
                    {translate('WALLET_UNLOCKING')}
                  </div>
                ) : (
                  <button
                    className="SafeTminiDecrypt-decrypt btn btn-primary btn-lg btn-block"
                    onClick={this.handleNullConnect}
                    disabled={isLoading}
                  >
                    {translate('ADD_SAFE_T_SCAN')}
                  </button>
                )}
                <div className={`SafeTminiDecrypt-error alert alert-danger ${showErr}`}>
                  {error || '-'}
                </div>
              </div>
            </div>

            <div className="SafeTminiDecrypt-description-footer">
              {translate('SAFET_MINI_HELP')}
            </div>
          </div>
        </div>
      );
    }
  }

  private handlePathChange = (dPath: DPath) => {
    this.setState({ dPath });
    this.handleConnect(dPath);
  };

  private handleConnect = (dPath: DPath): void => {
    this.setState({
      isLoading: true,
      error: null
    });

    SafeTWallet.getChainCode(dPath.value)
      .then(res => {
        this.setState({
          dPath,
          publicKey: res.publicKey,
          chainCode: res.chainCode,
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({
          error: err.message,
          isLoading: false
        });
      });
  };

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = (address: string, index: number) => {
    this.props.onUnlock(new SafeTWallet(address, this.state.dPath.value, index));
    this.reset();
  };

  private handleNullConnect = (): void => {
    this.handleConnect(this.state.dPath);
  };

  private reset() {
    const networks = this.context.networks;
    const network = this.context.getNetworkByName(this.props.formData.network);
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath:
        getDPath(network, SecureWalletName.SAFE_T) ||
        getDPaths(networks, SecureWalletName.SAFE_T)[0]
    });
  }
}

export const SafeTminiDecrypt = SafeTminiDecryptClass;
