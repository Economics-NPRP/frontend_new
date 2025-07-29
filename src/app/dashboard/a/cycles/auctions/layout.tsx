import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { PaginatedAuctionsProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'All Auctions',
};

export interface AllAuctionsListProps {
	table: ReactNode;
}
export default function AllAuctionsList({ table }: AllAuctionsListProps) {
	const t = useTranslations();

	return withProviders(
		<Stack className={classes.root}>
			<DashboardHero
				returnButton={{
					href: '/dashboard/a/cycles',
					label: t('constants.return.cyclesList.label'),
				}}
				breadcrumbs={[
					{
						label: t('constants.pages.dashboard.admin.home.title'),
						href: '/dashboard/a',
					},
					{
						label: t('constants.pages.dashboard.admin.cycles.title'),
						href: '/dashboard/a/cycles',
					},
					{
						label: t('constants.pages.dashboard.admin.cycles.auctions.title'),
						href: '/dashboard/a/cycles/auctions',
					},
				]}
			/>
			{table}
		</Stack>,
		{
			provider: PaginatedAuctionsProvider,
			props: {
				defaultPerPage: 20,
				defaultSortBy: 'created_at',
				defaultSortDirection: 'desc',
				syncWithSearchParams: true,
				id: 'paginatedAuctionsDashboard',
			},
		},
	);
}
