'use client';

import { DataTableSortStatus } from 'mantine-datatable';
import { useCallback, useMemo, useState } from 'react';

import { BidTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import {
	AuctionDetailsPageContext,
	DefaultAuctionDetailsPageContextData,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers/constants';
import { useDisclosure, useListState } from '@mantine/hooks';

export const PageProviders = ({ children }: { children: React.ReactNode }) => {
	const [isBidsDrawerOpen, { open: openBidsDrawer, close: closeBidsDrawer }] = useDisclosure(
		DefaultAuctionDetailsPageContextData.isBidsDrawerOpen,
	);

	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<BidTableData>>({
		columnAccessor: 'bid',
		direction: 'desc',
	});

	const [bids, bidsHandlers] = useListState<BidTableData>(
		DefaultAuctionDetailsPageContextData.bids,
	);
	const [bidConfirmationModalOpened, bidConfirmationModalActions] = useDisclosure(false);

	const [selectedBids, selectedBidsHandlers] = useListState<BidTableData>(
		DefaultAuctionDetailsPageContextData.selectedBids,
	);

	const [deletingBids, deletingBidsHandlers] = useListState<BidTableData>(
		DefaultAuctionDetailsPageContextData.deletingBids,
	);
	const [deleteModalOpened, deleteModalActions] = useDisclosure(false, {
		onClose: () =>
			deletingBidsHandlers.setState(DefaultAuctionDetailsPageContextData.deletingBids),
	});

	const [editingBid, setEditingBid] = useState<number>(
		DefaultAuctionDetailsPageContextData.editingBid,
	);
	const [editModalOpened, editModalActions] = useDisclosure(false, {
		onClose: () => setEditingBid(DefaultAuctionDetailsPageContextData.editingBid),
	});

	const totalPermits = useMemo(
		() =>
			bids.reduce(
				(acc, { permit }) => acc + permit,
				DefaultAuctionDetailsPageContextData.totalPermits,
			),
		[bids],
	);
	const grandTotal = useMemo(
		() =>
			bids.reduce(
				(acc, { bid, permit }) => acc + bid * permit,
				DefaultAuctionDetailsPageContextData.grandTotal,
			),
		[bids],
	);

	const resetState = useCallback(() => {
		bidsHandlers.setState(DefaultAuctionDetailsPageContextData.bids);
		selectedBidsHandlers.setState(DefaultAuctionDetailsPageContextData.selectedBids);
		deletingBidsHandlers.setState(DefaultAuctionDetailsPageContextData.deletingBids);
		setEditingBid(DefaultAuctionDetailsPageContextData.editingBid);
	}, [bidsHandlers, selectedBidsHandlers, deletingBidsHandlers]);

	return (
		<AuctionDetailsPageContext.Provider
			value={{
				isBidsDrawerOpen,
				openBidsDrawer,
				closeBidsDrawer,

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
			children={children}
		/>
	);
};
