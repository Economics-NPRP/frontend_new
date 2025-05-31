'use client';

import { useCallback, useContext } from 'react';

import { BidTable } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import {
	AuctionBiddingContext,
	DEFAULT_AUCTION_BIDDING_CONTEXT,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Group, Modal, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

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
		bidsHandlers.filter(({ bid }) => !deletingBids.map(({ bid }) => bid).includes(bid));

		//	Deselect the selected bids
		selectedBidsHandlers.filter(({ bid }) => !deletingBids.map(({ bid }) => bid).includes(bid));

		//	Reset the deletingBids list
		deletingBidsHandlers.setState(DEFAULT_AUCTION_BIDDING_CONTEXT.deletingBids);
		deleteModalActions.close();
	}, [selectedBidsHandlers, bidsHandlers]);

	return (
		<Modal
			opened={deleteModalOpened}
			onClose={deleteModalActions.close}
			withCloseButton={false}
			classNames={{
				root: classes.root,
				inner: classes.inner,
				content: classes.content,
				body: classes.body,
			}}
			centered
		>
			<Title order={2} className={classes.title}>
				Delete Your Bid(s)
			</Title>
			<Text className={classes.description}>
				Are you sure you want to delete the following bids? This action cannot be undone.
			</Text>
			<BidTable readOnly displayDeletingOnly />
			<Group className={classes.actions}>
				<Button
					className={classes.button}
					variant="outline"
					onClick={deleteModalActions.close}
				>
					Cancel
				</Button>
				<Button className={classes.button} onClick={onDeleteHandler} color="red">
					Delete Bid(s)
				</Button>
			</Group>
		</Modal>
	);
}
