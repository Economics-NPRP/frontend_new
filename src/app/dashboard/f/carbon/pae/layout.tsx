import { Metadata } from 'next';
import { ReactNode } from 'react';

import { Stack } from '@mantine/core';

import { withProviders } from 'helpers/withProviders';

import { PaginatedFirmAuctionsProvider } from 'contexts';

import classes from './styles.module.css';

export const metadata: Metadata = {
  title: 'Permits & Emissions',
};

export interface PermitsAndEmissionsProps {
  subbanners: ReactNode;
  auctions: ReactNode;
}
export default function PermitsAndEmissionsProps({ subbanners, auctions }: PermitsAndEmissionsProps) {

  return withProviders(
    <Stack className={classes.root}>
      {subbanners}
      {auctions}
    </Stack>,
    { provider: PaginatedFirmAuctionsProvider }
  );
}
