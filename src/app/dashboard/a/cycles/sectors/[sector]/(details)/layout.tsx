import { Metadata } from 'next';
import { ReactNode } from 'react';

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
	list: ReactNode;
}
export default function SectorDetails({ hero, distribution, list }: SectorDetailsProps) {
	return (
		<Stack className={classes.root}>
			{hero}
			{distribution}
			{list}
		</Stack>
	);
}
