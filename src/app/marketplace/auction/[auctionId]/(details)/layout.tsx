import { ReactNode } from 'react';

import {
	MyOpenAuctionResultsProvider,
	MyPaginatedBidsProvider,
	MyPaginatedWinningBidsProvider,
	PaginatedBidsProvider,
	PaginatedWinningBidsProvider,
	SingleAuctionProvider,
} from '@/contexts';
import { withProviders } from '@/helpers';
import { PageProviders } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Container, Group, Stack } from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';

import classes from './styles.module.css';

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
				<Group className={classes.details}>
					{card}
					{details}
				</Group>
				{bidding}
				{bidsDrawer}
				{suggestions}
			</Stack>
			{deleteBidModal}
			{editBidModal}
			{bidConfirmationModal}
			{ended}
		</>,
		{ provider: SingleAuctionProvider },
		{ provider: MyOpenAuctionResultsProvider },
		{ provider: MyPaginatedWinningBidsProvider },
		{ provider: PaginatedWinningBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: PaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: MyPaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: PageProviders },
	);
}
