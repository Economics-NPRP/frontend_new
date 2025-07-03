import { PaginatedAuctionsProvider } from 'contexts/PaginatedAuctions';
import { Metadata } from 'next';
import { ReactNode } from 'react';

// import { SingleAuctionCycleProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

// type Props = {
// 	params: Promise<{ cycleId: string }>;
// };
// export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
// 	const { cycleId } = await params;
// 	const cycle = await getSingleCycle(cycleId);
// 	if (!cycle) {
// 		return {
// 			title: {
// 				default: 'Cycle Not Found',
// 				template: '%s - Cycle Not Found',
// 			},
// 		};
// 	}
// 	return {
// 		title: {
// 			default: cycle.name,
// 			template: `%s - ${cycle.name}`,
// 		},
// 	};
// };

export const metadata: Metadata = {
	title: 'Cycle Details',
};

export interface CycleDetailsProps {
	params: { cycleId: string };
	actions: ReactNode;
	aside: ReactNode;
	hero: ReactNode;
	distribution: ReactNode;
	kpis: ReactNode;
	table: ReactNode;
}
export default function CycleDetails({
	params,
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
		// { provider: SingleAuctionCycleProvider },
		{
			provider: PaginatedAuctionsProvider,
			props: {
				defaultPerPage: 20,
				defaultSortBy: 'created_at',
				defaultSortDirection: 'desc',
				//	TODO: add cycle id to default filters
				// defaultFilters: {
				// 	type: [],
				// 	status: 'all',
				// 	sector: [],
				// 	owner: [],
				// 	cycle: [params.cycleId],
				// },
			},
		},
	);
}
