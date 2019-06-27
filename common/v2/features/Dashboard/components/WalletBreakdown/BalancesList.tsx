import React from 'react';
import { Button, CollapsibleTable, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import DashboardPanel from '../DashboardPanel';
import { Balance } from './types';

import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

const BackButton = styled(Button)`
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 20px;

  @media (min-width: 1080px) {
    font-size: 24px;
  }

  img {
    margin-right: 13px;
  }
`;

const BalancesOnlyTotal = styled(Typography)`
  margin: 0;
  font-size: 20px !important;
  font-weight: bold;

  @media (min-width: 1080px) {
    font-size: 24px !important;
  }
`;

interface BalancesListProps {
  balances: Balance[];
  totalFiatValue: number;
  toggleShowChart(): void;
}

export default function BalancesList({
  balances,
  toggleShowChart,
  totalFiatValue
}: BalancesListProps) {
  return (
    <DashboardPanel
      heading={
        <BackButton basic={true} onClick={toggleShowChart}>
          <img src={backArrowIcon} alt="Back arrow" /> Balance
        </BackButton>
      }
      headingRight={<BalancesOnlyTotal>${totalFiatValue.toFixed(2)}</BalancesOnlyTotal>}
    >
      <CollapsibleTable breakpoint={450} {...buildAccountTable(balances)} />
    </DashboardPanel>
  );
}

function buildAccountTable(balances: any[]) {
  return {
    head: ['TOKEN', 'AMOUNT', 'BALANCE'],
    body: balances.map(balance => {
      return [
        balance.name,
        `${balance.amount} ${balance.ticker}`,
        `$${balance.fiatValue.toFixed(2)}`
      ];
    }),
    config: {
      primaryColumn: 'TOKEN',
      sortableColumn: 'TOKEN',
      sortFunction: (a: any, b: any) => {
        const aLabel = a.props.name;
        const bLabel = b.props.name;
        return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
      },
      hiddenHeadings: ['AMOUNT']
    }
  };
}
