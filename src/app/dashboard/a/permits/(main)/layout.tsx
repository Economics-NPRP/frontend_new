import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { withProviders } from '@/helpers';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';
import { IconFileCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export const metadata: Metadata = {
  title: 'Permits',
};

export interface PermitsProps {
  subbanners: ReactNode;
  list: ReactNode;
}
export default function Permits({ subbanners, list }: PermitsProps) {
  const t = useTranslations();

  return withProviders(
    <Stack className={classes.root}>
      <DashboardHero
        icon={<IconFileCheck size={24} />}
        title={t('constants.pages.dashboard.admin.permits.title')}
        description={t('constants.pages.dashboard.admin.permits.description')}
        returnButton={{ href: '/dashboard/a', label: t('constants.return.home.label') }}
        breadcrumbs={[
          {
            label: t('constants.pages.dashboard.admin.home.title'),
            href: '/dashboard/a',
          },
          {
            label: t('constants.pages.dashboard.admin.permits.title'),
            href: '/dashboard/a/permits',
          },
        ]}
      />
      {subbanners}
      {list}
    </Stack>,
  );
}
