import { Metadata } from 'next';
import { ReactNode } from 'react';

import {
	AllOpenAuctionResultsProvider,
	AllWinningBidsProvider,
	MyOpenAuctionResultsProvider,
	MyPaginatedBidsProvider,
	PaginatedBidsProvider,
	PaginatedOpenAuctionResultsProvider,
	PaginatedWinningBidsProvider,
} from '@/contexts';
import { withProviders } from '@/helpers';
import { PageProvider } from '@/pages/marketplace/auction/[auctionId]/results/_components/Providers';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Results',
};

export interface AuctionResultsProps {
	bids: ReactNode;
	details: ReactNode;
	ongoing: ReactNode;
	ticket: ReactNode;
}
export default function AuctionResults({ bids, details, ongoing, ticket }: AuctionResultsProps) {
	return withProviders(
		<>
			<Stack className={classes.root}>
				{ticket}
				{details}
				{bids}
			</Stack>
			{ongoing}
		</>,
		{ provider: PaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: AllOpenAuctionResultsProvider },
		{ provider: AllWinningBidsProvider },
		{ provider: PaginatedWinningBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: MyPaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: PaginatedOpenAuctionResultsProvider, props: { defaultPerPage: 20 } },
		{ provider: MyOpenAuctionResultsProvider },
		{ provider: PageProvider },
	);
}
