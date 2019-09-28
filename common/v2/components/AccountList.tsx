import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Copyable, Identicon } from '@mycrypto/ui';

import { translateRaw } from 'translations';
import { ROUTE_PATHS, Fiats } from 'v2/config';
import { CollapsibleTable, Typography, Network } from 'v2/components';
import { truncate } from 'v2/utils';
import { BREAK_POINTS, COLORS, breakpointToNumber } from 'v2/theme';
import { ExtendedAccount, AddressBook, StoreAccount } from 'v2/types';
import {
  AccountContext,
  getLabelByAccount,
  StoreContext,
  SettingsContext,
  AddressBookContext
} from 'v2/services/Store';
import { DashboardPanel } from './DashboardPanel';
import './AccountList.scss';
import { RatesContext } from 'v2/services';
import { default as Currency } from './Currency';

const Label = styled.span`
  display: flex;
  align-items: center;
  p {
    margin-right: 27px;
  }
`;

const CurrencyContainer = styled(Currency)`
  float: right;
`;

const HeaderAlignment = styled.div`
  text-align: ${(props: { align?: string }) => props.align || 'inherit'};
`;

interface IFavoriteProps {
  favorited: boolean;
}

const FavoriteButton = styled(Button)`
  span {
    span {
      svg {
        path {
          fill: ${(props: IFavoriteProps) => (props.favorited ? COLORS.GOLD : 'white')};
          stroke: ${(props: IFavoriteProps) => (props.favorited ? COLORS.GOLD : '#7b8695')};
        }
      }
    }
  }
  align-self: flex-start;
  margin-left: 1em;
`;

const DeleteButton = styled(Button)`
  align-self: center;
  font-size: 0.7em;
`;

const TableContainer = styled.div`
  display: block;
  max-height: 394px;
  overflow: auto;
`;

type DeleteAccount = (uuid: string) => void;
type UpdateAccount = (uuid: string, accountData: ExtendedAccount) => void;
interface AccountListProps {
  className?: string;
  currentsOnly?: boolean;
  deletable?: boolean;
  favoritable?: boolean;
  footerAction?: string | JSX.Element;
  footerActionLink?: string;
}

export default function AccountList(props: AccountListProps) {
  const { className, currentsOnly, deletable, favoritable, footerAction, footerActionLink } = props;
  const { currentAccounts, accounts } = useContext(StoreContext);
  const { deleteAccount, updateAccount } = useContext(AccountContext);
  const shouldRedirect = accounts === undefined || accounts === null || accounts.length === 0;
  if (shouldRedirect) {
    return <Redirect to="/no-accounts" />;
  }

  return (
    <DashboardPanel
      heading={translateRaw('ACCOUNT_LIST_TABLE_YOUR_ACCOUNTS')}
      headingRight={'+ ' + translateRaw('ACCOUNT_LIST_TABLE_ADD_ACCOUNT')}
      actionLink={ROUTE_PATHS.ADD_ACCOUNT.path}
      className={`AccountList ${className}`}
      footerAction={footerAction}
      footerActionLink={footerActionLink}
    >
      <TableContainer>
        <CollapsibleTable
          breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
          {...buildAccountTable(
            currentsOnly ? currentAccounts() : accounts,
            deleteAccount,
            updateAccount,
            deletable,
            favoritable
          )}
        />
      </TableContainer>
    </DashboardPanel>
  );
}

function buildAccountTable(
  accounts: StoreAccount[],
  deleteAccount: DeleteAccount,
  updateAccount: UpdateAccount,
  deletable?: boolean,
  favoritable?: boolean
) {
  const { totalFiat } = useContext(StoreContext);
  const { getRate } = useContext(RatesContext);
  const { settings } = useContext(SettingsContext);
  const { addressBook } = useContext(AddressBookContext);
  const columns = [
    translateRaw('ACCOUNT_LIST_LABEL'),
    translateRaw('ACCOUNT_LIST_ADDRESS'),
    translateRaw('ACCOUNT_LIST_NETWORK'),
    <HeaderAlignment key={'ACCOUNT_LIST_VALUE'} align="center">
      {translateRaw('ACCOUNT_LIST_VALUE')}
    </HeaderAlignment>
  ];

  return {
    head: deletable ? [...columns, translateRaw('ACCOUNT_LIST_DELETE')] : columns,
    body: accounts.map((account, index) => {
      const addressCard: AddressBook | undefined = getLabelByAccount(account, addressBook);
      const total = totalFiat([account])(getRate);
      const label = addressCard ? addressCard.label : 'Unknown Account';
      const bodyContent = [
        <Label key={index}>
          <Identicon address={account.address} />
          <Typography>{label}</Typography>
        </Label>,
        <Copyable key={index} text={account.address} truncate={truncate} />,
        <Network key={index} color="#a682ff">
          {account.networkId}
        </Network>,
        <CurrencyContainer
          key={index}
          amount={total.toString()}
          symbol={Fiats[settings.fiatCurrency].symbol}
          prefix={Fiats[settings.fiatCurrency].prefix}
          decimals={2}
        />
      ];
      return deletable
        ? [
            ...bodyContent,
            <DeleteButton
              key={index}
              onClick={handleAccountDelete(deleteAccount, account.uuid)}
              icon="exit"
            />
          ]
        : favoritable
        ? [
            <FavoriteButton
              key={index}
              icon="star"
              favorited={account.favorite ? account.favorite : false}
              onClick={() =>
                updateAccount(account.uuid, {
                  ...account,
                  favorite: !account.favorite
                })
              }
            />,
            ...bodyContent
          ]
        : bodyContent;
    }),
    config: {
      primaryColumn: translateRaw('ACCOUNT_LIST_ADDRESS'),
      sortableColumn: translateRaw('ACCOUNT_LIST_ADDRESS'),
      sortFunction: (a: any, b: any) => {
        const aLabel = a.props.label;
        const bLabel = b.props.label;
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      },
      hiddenHeadings: deletable ? [translateRaw('ACCOUNT_LIST_DELETE')] : undefined,
      iconColumns: deletable ? [translateRaw('ACCOUNT_LIST_DELETE')] : undefined
    }
  };
}

/**
 * A higher order function that binds to an account uuid, which returns a handler that will
 * delete the bound account onClick
 */
function handleAccountDelete(deleteAccount: DeleteAccount, uuid: string) {
  return () => deleteAccount(uuid);
}
