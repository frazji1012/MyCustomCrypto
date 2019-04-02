import React, { Component } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Transition } from 'react-spring';
import classnames from 'classnames';
import { Icon } from '@mycrypto/ui';
import styled from 'styled-components';

import { UnlockScreen } from 'v2/features';
import { links } from './constants';
import './Header.scss';
import { COLORS } from 'v2/features/constants';

// Legacy
import logo from 'assets/images/logo-mycrypto.svg';

const { BRIGHT_SKY_BLUE } = COLORS;

interface PrefixIconProps {
  width: string;
  height: string;
}

const TitleIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

// prettier-ignore
const PrefixIcon = styled.img<PrefixIconProps>`
  ${props => props.width && `width: ${props.width};`}
  ${props => props.height && `height: ${props.height};`}
  margin-right: 3px;

  svg {
    color: ${BRIGHT_SKY_BLUE};
  }
`;

interface Props {
  drawerVisible: boolean;
  toggleDrawerVisible(): void;
  setDrawerScreen(screen: any): void;
}

interface State {
  menuOpen: boolean;
  visibleMenuDropdowns: {
    [dropdown: string]: boolean;
  };
  visibleDropdowns: {
    [dropdown: string]: boolean;
  };
}

interface LinkElement {
  to: string;
  title?: string;
  subItems?: LinkElement;
}

export class Header extends Component<Props & RouteComponentProps<{}>, State> {
  public state: State = {
    menuOpen: false,
    visibleMenuDropdowns: {
      'Manage Assets': false,
      Tools: false
    },
    visibleDropdowns: {
      'Manage Assets': false,
      Tools: false
    }
  };

  public render() {
    const { history, drawerVisible, toggleDrawerVisible, setDrawerScreen } = this.props;
    const { menuOpen, visibleMenuDropdowns, visibleDropdowns } = this.state;
    const onUnlockClick = () => {
      this.closeMenu();
      drawerVisible ? toggleDrawerVisible() : setDrawerScreen(UnlockScreen);
    };

    return (
      <nav className="_Header">
        {/* Mobile Menu */}
        <Transition from={{ left: '-375px' }} enter={{ left: '0' }} leave={{ left: '-500px' }}>
          {menuOpen &&
            ((style: any) => (
              <div style={style} className="_Header-menu">
                <ul className="_Header-menu-links">
                  {links.map(({ title, to, subItems, icon }) => {
                    const iconClassName = classnames('_Header-icon', {
                      '_Header-caret': !subItems
                    });

                    return (
                      <li
                        key={title}
                        onClick={e => {
                          e.stopPropagation();

                          if (to) {
                            history.push(to);
                            this.toggleMenu();
                          } else {
                            this.toggleMenuDropdown(title);
                          }
                        }}
                      >
                        <TitleIconWrapper>
                          {icon && <PrefixIcon {...icon} />}
                          {title} <Icon icon="navDownCaret" className={iconClassName} />
                        </TitleIconWrapper>
                        {subItems &&
                          visibleMenuDropdowns[title] && (
                            <ul>
                              {subItems.map(({ to: innerTo, title: innerTitle }: LinkElement) => (
                                <li
                                  key={innerTitle}
                                  onClick={() => {
                                    this.toggleMenu();
                                    history.push(innerTo);
                                  }}
                                >
                                  {innerTitle}
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                    );
                  })}
                </ul>
                <div className="_Header-menu-mid">
                  English <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
                </div>
                <ul className="_Header-menu-links">
                  <li>
                    Help & Support{' '}
                    <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
                  </li>
                  <li>
                    Latest News <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
                  </li>
                </ul>
              </div>
            ))}
        </Transition>
        <div className="_Header-top">
          {/* Mobile Left */}
          <div className="_Header-top-mobileLeft" role="button" onClick={this.toggleMenu}>
            <Icon icon={menuOpen ? 'exit' : 'combinedShape'} />
          </div>
          {/* Desktop Left */}
          <ul className="_Header-top-desktopLeft">
            <li>
              Help & Support <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
            </li>
            <li>
              Latest News <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
            </li>
          </ul>
          <div className="_Header-top-center">
            <Link to="/">
              <img src={logo} alt="Our logo" />
            </Link>
          </div>
          {/* Mobile Right */}
          <div className="_Header-top-mobileLeft" onClick={onUnlockClick}>
            <Icon icon={drawerVisible ? 'exit' : 'unlock'} />
          </div>
          {/* Desktop Right */}
          <ul className="_Header-top-desktopRight">
            <li>
              English <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
            </li>
            <li className="_Header-top-desktopRight-unlock" onClick={onUnlockClick}>
              <Icon icon="unlock" /> Unlock
            </li>
          </ul>
        </div>
        <div className="_Header-bottom">
          <div>
            <ul className="_Header-bottom-links">
              {links.map(({ title, to, subItems, icon }) => {
                const iconClassName = classnames('_Header-icon', {
                  '_Header-caret': !subItems
                });
                const liProps = to
                  ? { onClick: () => history.push(to) }
                  : {
                      onMouseEnter: () => this.toggleDropdown(title),
                      onMouseLeave: () => this.toggleDropdown(title)
                    };

                return (
                  <li key={title} {...liProps}>
                    {icon && <PrefixIcon {...icon} />} {title}{' '}
                    <Icon icon="navDownCaret" className={iconClassName} />
                    {subItems &&
                      visibleDropdowns[title] && (
                        <ul>
                          {subItems.map(({ to: innerTo, title: innerTitle }: LinkElement) => (
                            <li key={innerTitle} onClick={() => history.push(innerTo)}>
                              {innerTitle}
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  private toggleMenu = () => {
    const { drawerVisible, toggleDrawerVisible } = this.props;

    if (drawerVisible) {
      toggleDrawerVisible();
    }

    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen
    }));
  };

  private closeMenu = () =>
    this.setState({
      menuOpen: false
    });

  private toggleMenuDropdown = (dropdown: string) =>
    this.setState(prevState => ({
      visibleMenuDropdowns: {
        ...prevState.visibleMenuDropdowns,
        [dropdown]: !prevState.visibleMenuDropdowns[dropdown]
      }
    }));

  private toggleDropdown = (dropdown: string) =>
    this.setState(prevState => ({
      visibleDropdowns: {
        ...prevState.visibleDropdowns,
        [dropdown]: !prevState.visibleDropdowns[dropdown]
      }
    }));
}

export default withRouter(Header);
