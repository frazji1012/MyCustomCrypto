import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Transition } from 'react-spring/renderprops.cjs';

import { AppState } from 'features/reducers';
import { configMetaSelectors } from 'features/config';
import { sidebarSelectors } from 'features/sidebar';
import Sidebar from 'containers/Sidebar';
import NewFooter from 'components/Footer/NewFooter/NewFooter';
import OfflineTab from './OfflineTab';
import './WebTemplate.scss';

interface StateProps {
  isOffline: AppState['config']['meta']['offline'];
  latestBlock: AppState['config']['meta']['latestBlock'];
  sidebarVisible: ReturnType<typeof sidebarSelectors.getSidebarVisible>;
}

interface OwnProps {
  isUnavailableOffline?: boolean;
  children: string | React.ReactElement<string> | React.ReactElement<string>[];
}

type Props = OwnProps & StateProps;

class WebTemplate extends Component<Props, {}> {
  public render() {
    const { isUnavailableOffline, children, isOffline, sidebarVisible } = this.props;

    return (
      <React.Fragment>
        <div className="WebTemplate">
          <Transition
            items={sidebarVisible}
            from={{ right: '-375px' }}
            enter={{ right: '0' }}
            leave={{ right: '-1000px' }}
          >
            {visible => visible && ((style: any) => <Sidebar style={style} />)}
          </Transition>
          <div className="Tab container">
            {isUnavailableOffline && isOffline ? <OfflineTab /> : children}
          </div>
          <div className="WebTemplate-spacer" />
          <NewFooter />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    isOffline: configMetaSelectors.getOffline(state),
    latestBlock: configMetaSelectors.getLatestBlock(state),
    sidebarVisible: sidebarSelectors.getSidebarVisible(state)
  };
}

export default connect(mapStateToProps)(WebTemplate);
