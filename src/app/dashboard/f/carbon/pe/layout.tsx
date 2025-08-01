import { Metadata } from 'next';
import { ReactNode } from 'react';

import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Permits & Emissions',
};

export interface HomeProps {
	hero: ReactNode;
	subbanners: ReactNode;
	distribution: ReactNode;
	timeSeries: ReactNode;
	table: ReactNode;
}
export default function Home({ hero, subbanners, distribution, timeSeries, table }: HomeProps) {
	return (
		<Stack className={classes.root}>
			{hero}
			{subbanners}
			{distribution}
			{timeSeries}
			{table}
		</Stack>
	);
}
