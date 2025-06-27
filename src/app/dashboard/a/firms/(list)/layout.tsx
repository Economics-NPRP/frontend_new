import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { PaginatedFirmsProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Companies',
};

export interface FirmsListProps {
	subbanners: ReactNode;
	table: ReactNode;
}
export default function FirmsList({ subbanners, table }: FirmsListProps) {
	const t = useTranslations();

	return withProviders(
		<Stack className={classes.root}>
			<DashboardHero
				title={t('constants.pages.dashboard.admin.firms.title')}
				returnButton={{ href: '/dashboard/a', label: t('constants.return.home.label') }}
				breadcrumbs={[
					{
						label: t('constants.pages.dashboard.admin.home.title'),
						href: '/dashboard/a',
					},
					{
						label: t('constants.pages.dashboard.admin.firms.title'),
						href: '/dashboard/a/firms',
					},
				]}
			/>
			{subbanners}
			{table}
		</Stack>,
		{ provider: PaginatedFirmsProvider },
	);
}
