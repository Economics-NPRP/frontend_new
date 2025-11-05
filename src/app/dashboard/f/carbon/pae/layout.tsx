import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
  title: 'Permits & Emissions',
};

export interface PermitsAndEmissionsProps {
  subbanners: ReactNode;
}
export default function PermitsAndEmissionsProps({ subbanners }: PermitsAndEmissionsProps) {
  const t = useTranslations();

  return (
    <Stack className={classes.root}>
      {subbanners}
    </Stack>
  );
}
