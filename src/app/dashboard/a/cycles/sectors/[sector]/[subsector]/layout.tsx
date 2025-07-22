import { Metadata } from 'next';
import { ReactNode } from 'react';

import { PaginatedAuctionsProvider, SingleSubsectorProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { getSingleSubsector } from '@/lib/subsectors';
import { PageProvider } from '@/pages/dashboard/a/cycles/sectors/[sector]/[subsector]/_components/Providers/Providers';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

type Props = {
	params: Promise<{ subsector: string }>;
};
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const { subsector: subsectorId } = await params;
	const subsector = await getSingleSubsector(subsectorId);
	if (!subsector)
		return {
			title: {
				default: 'Subsector Not Found',
				template: 'Subsector Not Found',
			},
		};
	return {
		title: {
			default: subsector.title,
			template: `%s - ${subsector.title}`,
		},
	};
};

export interface SubsectorDetailsProps {
	hero: ReactNode;
	heatmap: ReactNode;
	timeSeries: ReactNode;
	table: ReactNode;
}
export default function SubsectorDetails({
	hero,
	heatmap,
	timeSeries,
	table,
}: SubsectorDetailsProps) {
	return withProviders(
		<Stack className={classes.root}>
			{hero}
			{heatmap}
			{timeSeries}
			{table}
		</Stack>,
		//	TODO: add sector filter once available
		{ provider: PaginatedAuctionsProvider, props: { defaultPerPage: 20 } },
		{ provider: SingleSubsectorProvider, props: { defaultPerPage: 20 } },
		{ provider: PageProvider },
	);
}
