import { Metadata } from 'next';
import { ReactNode } from 'react';

import { InfinitePaginatedAuctionsProvider, MyUserProfileProvider, PaginatedAuctionsProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { DefaultQueryFiltersData } from '@/schema/models';
import { Container } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Home',
};

export interface HomeProps {
	banner: ReactNode;
	cycle: ReactNode;
	subbanners: ReactNode;
	categories: ReactNode;
	promo: ReactNode;
	ending: ReactNode;
	catalogue: ReactNode;
}
export default function Home({
	banner,
	cycle,
	subbanners,
	categories,
	promo,
	ending,
	catalogue,
}: HomeProps) {
	return withProviders(
		<Container className={classes.root}>
			<Container className={classes.banners}>
				{banner}
				{cycle}
				{subbanners}
			</Container>
			{categories}
			{promo}
			{/* {ending} */}
			{catalogue}
		</Container>,
		{
			provider: InfinitePaginatedAuctionsProvider,
			props: {
				defaultPerPage: 12,
				defaultSortBy: 'end_datetime',
				defaultSortDirection: 'asc',
				defaultFilters: {
					...DefaultQueryFiltersData,
					status: 'ongoing',
				},
			},
		},
		{
			provider: PaginatedAuctionsProvider,
			props: {
				syncWithSearchParams: true,
				defaultFilters: {
					ownership: "government"
				}
			},
		},
		{
			provider: MyUserProfileProvider
		}
	);
}
