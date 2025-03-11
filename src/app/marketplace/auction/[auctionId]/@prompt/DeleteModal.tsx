import { useCallback, useContext } from 'react';

import { Button, Group, Modal, Text } from '@mantine/core';

import { AuctionBiddingContext, DEFAULT_CONTEXT } from './constants';

export const DeleteModal = () => {
	const {
		bidsHandlers,
		selectedBidsHandlers,
		deletingBids,
		deletingBidsHandlers,
		deleteModalOpened,
		deleteModalActions,
	} = useContext(AuctionBiddingContext);

	const onConfirmDeleteBidHandler = useCallback(() => {
		//	Remove the selected bids from the bids list
		bidsHandlers.filter(({ bid }) => !deletingBids.includes(bid));

		//	Deselect the selected bids
		selectedBidsHandlers.filter(({ bid }) => !deletingBids.includes(bid));

		//	Reset the deletingBids list
		deletingBidsHandlers.setState(DEFAULT_CONTEXT.deletingBids);
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
				<Button onClick={onConfirmDeleteBidHandler} color="red">
					Delete
				</Button>
			</Group>
		</Modal>
	);
};
