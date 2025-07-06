import { Metadata } from 'next';
import { ReactNode } from 'react';

import { PaginatedAuctionsInCycleProvider, SingleCycleProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { getSingleCycle } from '@/lib/cycles';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

type Props = {
	params: Promise<{ cycleId: string }>;
};
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const { cycleId } = await params;
	const cycle = await getSingleCycle(cycleId);
	if (!cycle) {
		return {
			title: {
				default: 'Cycle Not Found',
				template: '%s - Cycle Not Found',
			},
		};
	}
	return {
		title: {
			default: cycle.title,
			template: `%s - ${cycle.title}`,
		},
	};
};

export interface CycleDetailsProps {
	actions: ReactNode;
	aside: ReactNode;
	hero: ReactNode;
	distribution: ReactNode;
	kpis: ReactNode;
	table: ReactNode;
}
export default function CycleDetails({
	actions,
	aside,
	hero,
	distribution,
	kpis,
	table,
}: CycleDetailsProps) {
	return withProviders(
		<Stack className={classes.root}>
			{aside}
			{hero}
			{actions}
			{distribution}
			{kpis}
			{table}
		</Stack>,
		{ provider: SingleCycleProvider },
		{
			provider: PaginatedAuctionsInCycleProvider,
			props: {
				defaultPerPage: 20,
				defaultSortBy: 'created_at',
				defaultSortDirection: 'desc',
			},
		},
	);
}
