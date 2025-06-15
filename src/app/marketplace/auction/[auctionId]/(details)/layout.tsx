import { Metadata } from 'next';
import { ReactNode } from 'react';

import {
	AllWinningBidsProvider,
	InfinitePaginatedAuctionsProvider,
	MyOpenAuctionResultsProvider,
	MyPaginatedBidsProvider,
	MyPaginatedWinningBidsProvider,
	PaginatedBidsProvider,
	PaginatedWinningBidsProvider,
	RealtimeBidsProvider,
} from '@/contexts';
import { withProviders } from '@/helpers';
import { PageProviders } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Container, Stack } from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Details',
};

export interface AuctionDetailsProps {
	bidConfirmationModal: ReactNode;
	bidsDrawer: ReactNode;
	card: ReactNode;
	deleteBidModal: ReactNode;
	details: ReactNode;
	editBidModal: ReactNode;
	ended: ReactNode;
	bidding: ReactNode;
	suggestions: ReactNode;
}
export default function AuctionPage({
	bidConfirmationModal,
	bidsDrawer,
	card,
	deleteBidModal,
	details,
	editBidModal,
	ended,
	bidding,
	suggestions,
}: AuctionDetailsProps) {
	return withProviders(
		<>
			<Container className={classes.bg}>
				<Container className={`${classes.graphic} bg-grid-md`} />
				<Container className={classes.gradient} />
			</Container>
			<Stack className={classes.root}>
				<Button
					component="a"
					// TODO: change to explore page when available
					href="/marketplace"
					className={classes.button}
					leftSection={<IconArrowUpLeft />}
				>
					Return to Catalogue
				</Button>
				<Container className={classes.details}>
					{card}
					{details}
				</Container>
				{bidding}
				{bidsDrawer}
				{suggestions}
			</Stack>
			{deleteBidModal}
			{editBidModal}
			{bidConfirmationModal}
			{ended}
		</>,
		{ provider: RealtimeBidsProvider },
		{ provider: AllWinningBidsProvider },
		{ provider: MyOpenAuctionResultsProvider },
		{ provider: MyPaginatedWinningBidsProvider },
		{ provider: PaginatedWinningBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: PaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: MyPaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: PageProviders },
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
	);
}
