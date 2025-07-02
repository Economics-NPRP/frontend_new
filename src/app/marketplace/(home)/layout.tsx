import { Metadata } from 'next';
import { ReactNode } from 'react';

import { InfinitePaginatedAuctionsProvider, PaginatedAuctionsProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { Container } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Home',
};

export interface HomeProps {
	banner: ReactNode;
	subbanners: ReactNode;
	categories: ReactNode;
	calendar: ReactNode;
	ending: ReactNode;
	catalogue: ReactNode;
}
export default function Home({
	banner,
	subbanners,
	categories,
	calendar,
	ending,
	catalogue,
}: HomeProps) {
	return withProviders(
		<Container className={classes.root}>
			<Container className={classes.banners}>
				{banner}
				{subbanners}
			</Container>
			{categories}
			{calendar}
			{ending}
			{catalogue}
		</Container>,
		{
			provider: InfinitePaginatedAuctionsProvider,
			props: {
				defaultPerPage: 12,
				defaultSortBy: 'end_datetime',
				defaultSortDirection: 'asc',
				defaultFilters: {
					type: [],
					status: 'ongoing',
					sector: [],
					owner: [],
				},
			},
		},
		{
			provider: PaginatedAuctionsProvider,
		},
	);
}
