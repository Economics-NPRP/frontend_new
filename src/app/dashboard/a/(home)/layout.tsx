import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';
import { withProviders } from 'helpers/withProviders';
import { PaginatedAuctionCyclesProvider } from 'contexts/PaginatedAuctionCycles';
export const metadata: Metadata = {
	title: 'Home',
};

export interface HomeProps {
	content: ReactNode;
}
export default function Home({ content }: HomeProps) {
	const t = useTranslations();

	return withProviders(
		<Stack className={classes.root}>
			<DashboardHero
				title={t('constants.pages.dashboard.admin.home.title')}
				breadcrumbs={[
					{
						label: t('constants.pages.dashboard.admin.home.title'),
						href: '/dashboard/a',
					},
				]}
			/>
			{content}
		</Stack>
	, {
		provider: PaginatedAuctionCyclesProvider, props: {
			status: 'ongoing',
		}
	});
}
