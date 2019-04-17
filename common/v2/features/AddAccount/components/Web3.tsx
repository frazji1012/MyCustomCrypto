import React, { PureComponent } from 'react';

import translate from 'translations';
import { NewTabLink } from 'components/ui';
import './Web3.scss';

interface Props {
  onUnlock(): void;
}
interface State {
  address: string;
}

export class Web3DecryptClass extends PureComponent<Props, State> {
  public state: State = {
    address: ''
  };


  public render () {
    return(
      <div className="Web3Decrypt">
        <div>
          <button className="Web3Decrypt-decrypt btn btn-primary btn-lg btn-block" onClick={this.props.onUnlock}>
            {translate('ADD_METAMASK')}
          </button>
        </div>

        <div>
          <NewTabLink
            className="Web3Decrypt-install btn btn-sm btn-default btn-block"
            content={translate('ACTION_13', { $thing: 'MetaMask' })}
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
          />
        </div>

        <p style={{ marginTop: '1rem' }}>
          In order to use MetaMask with MyCrypto, your ad blocker must be disabled.
        </p>
      </div>
    )
  };
}
