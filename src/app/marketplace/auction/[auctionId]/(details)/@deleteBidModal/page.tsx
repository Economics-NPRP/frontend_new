'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useContext } from 'react';

import { BiddingTable } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingTable';
import {
	AuctionDetailsPageContext,
	DefaultAuctionDetailsPageContextData,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Group, Modal, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export default function DeleteModal() {
	const t = useTranslations();
	const {
		bidsHandlers,
		selectedBidsHandlers,
		deletingBids,
		deletingBidsHandlers,
		deleteModalOpened,
		deleteModalActions,
	} = useContext(AuctionDetailsPageContext);

	const onDeleteHandler = useCallback(() => {
		//	Remove the selected bids from the bids list
		bidsHandlers.filter(({ bid }) => !deletingBids.map(({ bid }) => bid).includes(bid));

		//	Deselect the selected bids
		selectedBidsHandlers.filter(({ bid }) => !deletingBids.map(({ bid }) => bid).includes(bid));

		//	Reset the deletingBids list
		deletingBidsHandlers.setState(DefaultAuctionDetailsPageContextData.deletingBids);
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
				{t('marketplace.auction.details.deleteBidModal.title')}
			</Title>
			<Text className={classes.description}>
				{t('marketplace.auction.details.deleteBidModal.description')}
			</Text>
			<BiddingTable className={classes.table} readOnly displayDeletingOnly />
			<Group className={classes.actions}>
				<Button
					className={`${classes.secondary} ${classes.button}`}
					variant="outline"
					onClick={deleteModalActions.close}
				>
					{t('constants.actions.cancel.label')}
				</Button>
				<Button className={classes.button} onClick={onDeleteHandler} color="red">
					{t('marketplace.auction.details.deleteBidModal.actions.delete')}
				</Button>
			</Group>
		</Modal>
	);
}
