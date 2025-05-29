import { ReactNode } from 'react';

import { Providers } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Container, Stack } from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface AuctionDetailsProps {
	bidConfirmationModal: ReactNode;
	bidsDrawer: ReactNode;
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
				{details}
				{bidsDrawer}
				{bidding}
				{suggestions}
			</Stack>
			{deleteBidModal}
			{editBidModal}
			{bidConfirmationModal}
			{ended}
		</Providers>
	);
}
