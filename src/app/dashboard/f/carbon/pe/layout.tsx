import { Metadata } from 'next';
import { ReactNode } from 'react';

import { withProviders } from '@/helpers';
import { PageProvider } from '@/pages/dashboard/f/carbon/pe/_components/Providers';
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
	return withProviders(
		<Stack className={classes.root}>
			{hero}
			{subbanners}
			{timeSeries}
			{distribution}
			{table}
		</Stack>,
		{ provider: PageProvider },
	);
}
