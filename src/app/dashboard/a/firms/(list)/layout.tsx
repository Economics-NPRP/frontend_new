import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { PaginatedFirmsProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Firms',
};

export interface FirmsListProps {
	table: ReactNode;
}
export default function FirmsList({ table }: FirmsListProps) {
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
			{table}
		</Stack>,
		{ provider: PaginatedFirmsProvider },
	);
}
