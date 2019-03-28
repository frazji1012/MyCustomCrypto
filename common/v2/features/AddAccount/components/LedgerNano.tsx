import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { SecureWalletName, ledgerReferralURL, HELP_ARTICLE } from 'config';
import translate, { translateRaw } from 'translations';
import { LedgerWallet } from 'libs/wallet';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import { configSelectors, configNetworksStaticSelectors } from 'features/config';
import { Spinner, NewTabLink, HelpLink } from 'components/ui';
import UnsupportedNetwork from './UnsupportedNetwork';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import './LedgerNano.scss';
import styled from 'styled-components';
import { Button, Typography } from '@mycrypto/ui';
import ledgerIcon from 'common/assets/images/icn-ledger-nano-large.svg';

const LedgerDecrypt = styled.div`
  text-align: center;
`;

const LedgerImage = styled.div`
  padding: 50px;
`;

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  dPath: DPath | undefined;
  dPaths: DPath[];
  network: NetworkConfig;
}

interface State {
  publicKey: string;
  chainCode: string;
  dPath: DPath;
  error: string | null;
  isLoading: boolean;
}

type Props = OwnProps & StateProps;

class LedgerNanoSDecryptClass extends PureComponent<Props, State> {
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath: this.props.dPath || this.props.dPaths[0],
    error: null,
    isLoading: false
  };

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.dPath !== nextProps.dPath && nextProps.dPath) {
      this.setState({ dPath: nextProps.dPath });
    }
  }

  public render() {
    const { dPath, publicKey, chainCode, error, isLoading } = this.state;
    const showErr = error ? 'is-showing' : '';

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('x_Ledger')} />;
    }

    if (!process.env.BUILD_ELECTRON && window.location.protocol !== 'https:') {
      return (
        <LedgerDecrypt>
          <div className="alert alert-danger">
            Unlocking a Ledger hardware wallet is only possible on pages served over HTTPS. You can
            unlock your wallet at <NewTabLink href="https://mycrypto.com">MyCrypto.com</NewTabLink>
          </div>
        </LedgerDecrypt>
      );
    }

    return (
      <LedgerDecrypt>
        <div className="LedgerDecrypt-tip">
          <Typography>{translate('LEDGER_TIP')}</Typography>
        </div>
        <LedgerImage>
          <img src={ledgerIcon} />
        </LedgerImage>

        <Button
          className="LedgerDecrypt-decrypt btn btn-primary btn-lg btn-block"
          onClick={this.handleNullConnect}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="LedgerDecrypt-message">
              <Spinner light={true} />
              {translate('WALLET_UNLOCKING')}
            </div>
          ) : (
            translate('ADD_LEDGER_SCAN')
          )}
        </Button>

        <div className={`LedgerDecrypt-error alert alert-danger ${showErr}`}>{error || '-'}</div>

        <Typography>{translate('LEDGER_REFERRAL_2')}</Typography>
        <div className="LedgerDecrypt-help">
          <Typography>
            {/* article={HELP_ARTICLE.HOW_TO_USE_LEDGER} */}
            {translate('HELP_ARTICLE_1')}
          </Typography>
        </div>

        <DeterministicWalletsModal
          isOpen={!!publicKey && !!chainCode}
          publicKey={publicKey}
          chainCode={chainCode}
          dPath={dPath}
          dPaths={this.props.dPaths}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
        />
      </LedgerDecrypt>
    );
  }

  private handlePathChange = (dPath: DPath) => {
    this.handleConnect(dPath);
    this.setState({
      dPath
    });
  };

  private handleConnect = (dPath: DPath) => {
    this.setState({
      isLoading: true,
      error: null
    });

    LedgerWallet.getChainCode(dPath.value)
      .then(res => {
        this.setState({
          publicKey: res.publicKey,
          chainCode: res.chainCode,
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({
          error: translateRaw(err.message),
          isLoading: false
        });
      });
  };

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = (address: string, index: number) => {
    this.props.onUnlock(new LedgerWallet(address, this.state.dPath.value, index));
    this.reset();
  };

  private handleNullConnect = (): void => {
    return this.handleConnect(this.state.dPath);
  };

  private reset() {
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath: this.props.dPath || this.props.dPaths[0]
    });
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    dPath: configSelectors.getSingleDPath(state, SecureWalletName.LEDGER_NANO_S),
    dPaths: configNetworksStaticSelectors.getPaths(state, SecureWalletName.LEDGER_NANO_S),
    network: configSelectors.getNetworkConfig(state)
  };
}

export const LedgerNanoSDecrypt = connect(mapStateToProps)(LedgerNanoSDecryptClass);
