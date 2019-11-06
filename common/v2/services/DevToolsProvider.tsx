import React, { Component, createContext } from 'react';

export interface ProviderState {
  isActive: boolean;
  displayRecentTransactionList: boolean;
  toggleDevTools(): void;
}

const DevToolsContext = createContext({} as ProviderState);

class DevToolsProvider extends Component {
  public readonly state: ProviderState = {
    isActive: false,
    // Example of runtime switchable feature flag in a Trunk Based Develompent environment
    // https://trunkbaseddevelopment.com/feature-flags/
    displayRecentTransactionList: true,
    toggleDevTools: (): void => this.setState({ isActive: !this.state.isActive })
  };

  public render() {
    const { children } = this.props;
    return <DevToolsContext.Provider value={this.state}>{children}</DevToolsContext.Provider>;
  }
}

function useDevTools() {
  const context = React.useContext(DevToolsContext);
  if (context === undefined) {
    throw new Error('useDevTools must be used with a DevTools Provider');
  }
  return context;
}

export { DevToolsProvider, DevToolsContext, useDevTools };
