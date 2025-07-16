import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Sectors',
};

export interface SectorsListProps {
	grid: ReactNode;
}
export default function SectorsList({ grid }: SectorsListProps) {
	const t = useTranslations();

	return (
		<Stack className={classes.root}>
			<DashboardHero
				title={t('constants.pages.dashboard.admin.cycles.sectors.title')}
				description={t('constants.pages.dashboard.admin.cycles.sectors.description')}
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
						label: t('constants.pages.dashboard.admin.cycles.sectors.title'),
						href: '/dashboard/a/cycles/sectors',
					},
				]}
			/>
			{grid}
		</Stack>
	);
}
