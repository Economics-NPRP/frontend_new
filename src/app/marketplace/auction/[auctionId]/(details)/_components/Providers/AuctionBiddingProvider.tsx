'use client';

import { DataTableSortStatus } from 'mantine-datatable';
import { useCallback, useMemo, useState } from 'react';

import { BidTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import {
	AuctionBiddingContext,
	DEFAULT_AUCTION_BIDDING_CONTEXT,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { useDisclosure, useListState } from '@mantine/hooks';

export const AuctionBiddingProvider = ({ children }: { children: React.ReactNode }) => {
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<BidTableData>>({
		columnAccessor: 'bid',
		direction: 'desc',
	});

	const [bids, bidsHandlers] = useListState<BidTableData>(DEFAULT_AUCTION_BIDDING_CONTEXT.bids);
	const [bidConfirmationModalOpened, bidConfirmationModalActions] = useDisclosure(false);

	const [selectedBids, selectedBidsHandlers] = useListState<BidTableData>(
		DEFAULT_AUCTION_BIDDING_CONTEXT.selectedBids,
	);

	const [deletingBids, deletingBidsHandlers] = useListState<BidTableData>(
		DEFAULT_AUCTION_BIDDING_CONTEXT.deletingBids,
	);
	const [deleteModalOpened, deleteModalActions] = useDisclosure(false, {
		onClose: () => deletingBidsHandlers.setState(DEFAULT_AUCTION_BIDDING_CONTEXT.deletingBids),
	});

	const [editingBid, setEditingBid] = useState<number>(
		DEFAULT_AUCTION_BIDDING_CONTEXT.editingBid,
	);
	const [editModalOpened, editModalActions] = useDisclosure(false, {
		onClose: () => setEditingBid(DEFAULT_AUCTION_BIDDING_CONTEXT.editingBid),
	});

	const totalPermits = useMemo(
		() =>
			bids.reduce(
				(acc, { permit }) => acc + permit,
				DEFAULT_AUCTION_BIDDING_CONTEXT.totalPermits,
			),
		[bids],
	);
	const grandTotal = useMemo(
		() =>
			bids.reduce(
				(acc, { bid, permit }) => acc + bid * permit,
				DEFAULT_AUCTION_BIDDING_CONTEXT.grandTotal,
			),
		[bids],
	);

	const resetState = useCallback(() => {
		bidsHandlers.setState(DEFAULT_AUCTION_BIDDING_CONTEXT.bids);
		selectedBidsHandlers.setState(DEFAULT_AUCTION_BIDDING_CONTEXT.selectedBids);
		deletingBidsHandlers.setState(DEFAULT_AUCTION_BIDDING_CONTEXT.deletingBids);
		setEditingBid(DEFAULT_AUCTION_BIDDING_CONTEXT.editingBid);
	}, [bidsHandlers, selectedBidsHandlers, deletingBidsHandlers]);

	return (
		<AuctionBiddingContext.Provider
			value={{
				bids,
				bidsHandlers,
				bidConfirmationModalOpened,
				bidConfirmationModalActions,

				selectedBids,
				selectedBidsHandlers,

				deletingBids,
				deletingBidsHandlers,
				deleteModalOpened,
				deleteModalActions,

				editingBid,
				setEditingBid,
				editModalOpened,
				editModalActions,

				sortStatus,
				setSortStatus,

				totalPermits,
				grandTotal,

				resetState,
			}}
		>
			{children}
		</AuctionBiddingContext.Provider>
	);
};
