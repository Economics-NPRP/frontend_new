import { Metadata } from 'next';
import { ReactNode } from 'react';

import { PaginatedAuctionsProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import English from '@/locales/en.json';
import { SectorType } from '@/schema/models';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

type Props = {
	params: Promise<{ sector: string }>;
};
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const { sector } = await params;
	const sectorName = English.constants.sector[sector as SectorType].title;
	return {
		title: {
			default: sectorName,
			template: `%s - ${sectorName}`,
		},
	};
};

export interface SectorDetailsProps {
	hero: ReactNode;
	distribution: ReactNode;
	heatmap: ReactNode;
	timeSeries: ReactNode;
	list: ReactNode;
	table: ReactNode;
}
export default function SectorDetails({
	hero,
	distribution,
	heatmap,
	timeSeries,
	list,
	table,
}: SectorDetailsProps) {
	return withProviders(
		<Stack className={classes.root}>
			{hero}
			{distribution}
			{heatmap}
			{timeSeries}
			{list}
			{table}
		</Stack>,
		//	TODO: add sector filter once available
		{ provider: PaginatedAuctionsProvider, props: { defaultPerPage: 20 } },
	);
}
