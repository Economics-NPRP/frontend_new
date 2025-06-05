import { PropsWithChildren, ReactNode } from 'react';

import {
	MyOpenAuctionResultsProvider,
	MyPaginatedBidsProvider,
	MyPaginatedWinningBidsProvider,
	PaginatedBidsProvider,
	PaginatedWinningBidsProvider,
	SingleAuctionProvider,
} from '@/contexts';
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
	return (
		<Providers>
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
		</Providers>
	);
}

const Providers = ({ children }: PropsWithChildren) => (
	<SingleAuctionProvider>
		<MyOpenAuctionResultsProvider>
			<MyPaginatedWinningBidsProvider>
				<PaginatedWinningBidsProvider defaultPerPage={20}>
					<PaginatedBidsProvider defaultPerPage={20}>
						<MyPaginatedBidsProvider defaultPerPage={20}>
							<PageProviders>{children}</PageProviders>
						</MyPaginatedBidsProvider>
					</PaginatedBidsProvider>
				</PaginatedWinningBidsProvider>
			</MyPaginatedWinningBidsProvider>
		</MyOpenAuctionResultsProvider>
	</SingleAuctionProvider>
);
