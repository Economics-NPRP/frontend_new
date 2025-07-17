import { Metadata } from 'next';
import { ReactNode } from 'react';

import { Stack } from '@mantine/core';

import classes from './styles.module.css';

type Props = {
	params: Promise<{ sector: string }>;
};
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const { sector } = await params;
	return {
		title: {
			default: sector,
			template: `%s - ${sector}`,
		},
	};
};

export interface SectorDetailsProps {
	hero: ReactNode;
	list: ReactNode;
}
export default function SectorDetails({ hero, list }: SectorDetailsProps) {
	return (
		<Stack className={classes.root}>
			{hero}
			{list}
		</Stack>
	);
}
