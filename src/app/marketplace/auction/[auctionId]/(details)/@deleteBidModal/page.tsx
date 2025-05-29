'use client';

import { useCallback, useContext } from 'react';

import {
	AuctionBiddingContext,
	DEFAULT_AUCTION_BIDDING_CONTEXT,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Group, Modal, Text } from '@mantine/core';

export default function DeleteModal() {
	const {
		bidsHandlers,
		selectedBidsHandlers,
		deletingBids,
		deletingBidsHandlers,
		deleteModalOpened,
		deleteModalActions,
	} = useContext(AuctionBiddingContext);

	const onDeleteHandler = useCallback(() => {
		//	Remove the selected bids from the bids list
		bidsHandlers.filter(({ bid }) => !deletingBids.includes(bid));

		//	Deselect the selected bids
		selectedBidsHandlers.filter(({ bid }) => !deletingBids.includes(bid));

		//	Reset the deletingBids list
		deletingBidsHandlers.setState(DEFAULT_AUCTION_BIDDING_CONTEXT.deletingBids);
		deleteModalActions.close();
	}, [selectedBidsHandlers, bidsHandlers]);

	return (
		<Modal
			title="Delete Confirmation"
			opened={deleteModalOpened}
			onClose={deleteModalActions.close}
			centered
		>
			<Text>Are you sure you want to delete this bid?</Text>
			<Group>
				<Button onClick={deleteModalActions.close}>Cancel</Button>
				<Button onClick={onDeleteHandler} color="red">
					Delete
				</Button>
			</Group>
		</Modal>
	);
}
