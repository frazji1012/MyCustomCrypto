import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import { Layout } from 'v2/features';
import { ContentPanel } from 'v2/components';

import { GlobalSettingsContext } from 'v2/providers';

import { makeBlob } from 'utils/blob';

const CenteredContentPanel = styled(ContentPanel)`
  width: 35rem;
`;

const ImportSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FullWidthButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

const FullWidthLink = styled(Link)`
  width: 100%;
`;

const FullWidthDownloadLink = styled.a`
  width: 100%;
`;

const CacheDisplay = styled.code`
  overflow: auto;
  width: 100%;
  height: 10rem;
`;

class Downloader extends React.Component<{ cache: string }> {
  public state = { blob: '', name: '' };
  componentDidMount() {
    const settingsBlob = makeBlob('text/json;charset=UTF-8', this.props.cache);
    this.setState({ blob: settingsBlob, name: 'MyCryptoSettings.json' });
  }

  public render() {
    const { blob, name } = this.state;
    return (
      <FullWidthDownloadLink href={blob} download={name}>
        <FullWidthButton>Download</FullWidthButton>
      </FullWidthDownloadLink>
    );
  }
}

export class Export extends React.Component<RouteComponentProps<{}>> {
  public render() {
    const { history } = this.props;
    const onBack = history.goBack;
    return (
      <Layout centered={true}>
        <GlobalSettingsContext.Consumer>
          {({ localCache }) => (
            <CenteredContentPanel onBack={onBack} heading="Export">
              <ImportSuccessContainer>
                <Typography>Your MyCrypto settings file is ready.</Typography>
                <CacheDisplay>{localCache}</CacheDisplay>
                <FullWidthLink to="/dashboard/settings">
                  <FullWidthButton>Back To Settings</FullWidthButton>
                </FullWidthLink>
                <Downloader cache={localCache} />
              </ImportSuccessContainer>
            </CenteredContentPanel>
          )}
        </GlobalSettingsContext.Consumer>
      </Layout>
    );
  }
}

export default withRouter(Export);
