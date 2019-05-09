import React, { useState, useContext } from 'react';
import { Button, ComboBox } from '@mycrypto/ui';

import { translate } from 'translations';
import { NetworkOptionsContext } from 'v2/providers';
import { isWalletFormatSupportedOnNetwork } from 'v2/libs';
import { FormDataActionType as ActionType } from '../types';

function NetworkSelectPanel({ formData, formDispatch, goToNextStep }) {
  const [network, setNetwork] = useState(formData.network);
  const { networkOptions } = useContext(NetworkOptionsContext);

  // @ADD_ACCOUNT_TODO: The difference in accountType is likely causing
  // the absence of list.
  const validNetworks = networkOptions
    .filter(options => isWalletFormatSupportedOnNetwork(options, formData.accountType))
    .map(n => n.name);

  const onSubmit = () => {
    formDispatch({
      type: ActionType.SELECT_NETWORK,
      payload: { network }
    });
    goToNextStep();
  };

  return (
    <div className="Panel">
      <div className="Panel-title">{translate('ADD_ACCOUNT_NETWORK_TITLE')}</div>
      <div className="Panel-description">{translate('ADD_ACCOUNT_NETWORK_SELCT')}</div>
      <label className="Panel-networkLabel">Network</label>
      <ComboBox
        className="Panel-dropdown"
        value={network}
        items={new Set(validNetworks.sort())}
        placeholder="Ethereum"
        onChange={({ target: { value } }) => setNetwork(value)}
      />
      <Button className="Panel-description-button" onClick={onSubmit}>
        {translate('ADD_ACCOUNT_NETWORK_ACTION')}
      </Button>
    </div>
  );
}

export default NetworkSelectPanel;
