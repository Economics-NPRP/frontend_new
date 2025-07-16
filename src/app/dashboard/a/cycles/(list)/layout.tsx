import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { PaginatedAuctionCyclesProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Auction Cycles',
};

export interface CyclesListProps {
	subbanners: ReactNode;
	list: ReactNode;
}
export default function CyclesList({ subbanners, list }: CyclesListProps) {
	const t = useTranslations();

	return withProviders(
		<Stack className={classes.root}>
			<DashboardHero
				icon={<IconCalendar size={24} />}
				title={t('constants.pages.dashboard.admin.cycles.title')}
				description={t('constants.pages.dashboard.admin.cycles.description')}
				returnButton={{ href: '/dashboard/a', label: t('constants.return.home.label') }}
				breadcrumbs={[
					{
						label: t('constants.pages.dashboard.admin.home.title'),
						href: '/dashboard/a',
					},
					{
						label: t('constants.pages.dashboard.admin.cycles.title'),
						href: '/dashboard/a/cycles',
					},
				]}
			/>
			{subbanners}
			{list}
		</Stack>,
		{ provider: PaginatedAuctionCyclesProvider },
	);
}
