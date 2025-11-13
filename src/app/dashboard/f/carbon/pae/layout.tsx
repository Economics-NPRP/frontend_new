import { Metadata } from 'next';
import { ReactNode } from 'react';

import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
  title: 'Permits & Emissions',
};

export interface PermitsAndEmissionsProps {
  subbanners: ReactNode;
  auctions: ReactNode;
  emissionKpis: ReactNode;
}
export default function PermitsAndEmissionsProps({ subbanners, auctions, emissionKpis }: PermitsAndEmissionsProps) {

  return (
    <Stack className={classes.root}>
      {subbanners}
      {auctions}
      {emissionKpis}
    </Stack>
  );
}
