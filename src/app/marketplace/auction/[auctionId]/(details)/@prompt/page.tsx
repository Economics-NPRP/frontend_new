'use client';

import { DataTableSortStatus } from 'mantine-datatable';
import { useFormatter } from 'next-intl';
import { useCallback, useContext, useMemo, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { ActionIcon, Button, Group, Progress, Stack, Text } from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { IconChartLine } from '@tabler/icons-react';

import { AuctionDetailsContext } from '../constants';
import { BidConfirmationModal } from './BidConfirmationModal';
import { BidTable } from './BidTable';
import { DeleteModal } from './DeleteModal';
import { EditModal } from './EditModal';
import { InsertForm } from './InsertForm';
import { JoinOverlay } from './JoinOverlay';
import { AuctionBiddingContext, DEFAULT_CONTEXT } from './constants';
import { BidTableData } from './types';

export default function Prompt() {
	const format = useFormatter();
	const { auctionData } = useContext(AuctionDetailsContext);

	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<BidTableData>>({
		columnAccessor: 'bid',
		direction: 'desc',
	});

	const [bids, bidsHandlers] = useListState<BidTableData>(DEFAULT_CONTEXT.bids);
	const [bidConfirmationModalOpened, bidConfirmationModalActions] = useDisclosure(false);

	const [selectedBids, selectedBidsHandlers] = useListState<BidTableData>(
		DEFAULT_CONTEXT.selectedBids,
	);

	const [deletingBids, deletingBidsHandlers] = useListState<number>(DEFAULT_CONTEXT.deletingBids);
	const [deleteModalOpened, deleteModalActions] = useDisclosure(false, {
		onClose: () => deletingBidsHandlers.setState(DEFAULT_CONTEXT.deletingBids),
	});

	const [editingBid, setEditingBid] = useState<number>(DEFAULT_CONTEXT.editingBid);
	const [editModalOpened, editModalActions] = useDisclosure(false, {
		onClose: () => setEditingBid(DEFAULT_CONTEXT.editingBid),
	});

	const totalPermits = useMemo(
		() => bids.reduce((acc, { permit }) => acc + permit, DEFAULT_CONTEXT.totalPermits),
		[bids],
	);
	const grandTotal = useMemo(
		() => bids.reduce((acc, { bid, permit }) => acc + bid * permit, DEFAULT_CONTEXT.grandTotal),
		[bids],
	);

	const resetState = useCallback(() => {
		bidsHandlers.setState(DEFAULT_CONTEXT.bids);
		selectedBidsHandlers.setState(DEFAULT_CONTEXT.selectedBids);
		deletingBidsHandlers.setState(DEFAULT_CONTEXT.deletingBids);
		setEditingBid(DEFAULT_CONTEXT.editingBid);
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
			<Stack className="relative">
				{!auctionData.hasJoined && <JoinOverlay />}
				<Stack>
					<Text>Buy Now Price</Text>
					<Group>
						<CurrencyBadge />
						<Text>1,400.00</Text>
					</Group>
					<Button disabled={!auctionData.hasJoined}>Buy Now</Button>
				</Stack>
				<Group>
					<Stack>
						<Text>Minimum Winning Bid</Text>
						<Group>
							<CurrencyBadge />
							<Text>1,105.99</Text>
						</Group>
						<ActionIcon>
							<IconChartLine />
						</ActionIcon>
					</Stack>
					<Stack>
						<InsertForm />
						<Group>
							<Text>{totalPermits} permits bid</Text>
							<Progress w={480} value={(totalPermits / auctionData.permits) * 100} />
							<Text>{auctionData.permits - totalPermits} permits left</Text>
						</Group>
						<BidTable />
						<Stack>
							<Text>Grand Total</Text>
							<Group>
								<Stack>
									<Text>Permits</Text>
									<Text>{format.number(totalPermits)}</Text>
								</Stack>
								<Stack>
									<Text>Emissions (tCO2e)</Text>
									<Text>{format.number(totalPermits * 1000)}</Text>
								</Stack>
								<Stack>
									<Text>Bid</Text>
									<Group>
										<CurrencyBadge />
										<Text>{format.number(grandTotal, 'money')}</Text>
									</Group>
								</Stack>
							</Group>
						</Stack>
					</Stack>
				</Group>
				<Button
					disabled={!auctionData.hasJoined || bids.length === 0}
					onClick={bidConfirmationModalActions.open}
				>
					Place a Bid
				</Button>

				<BidConfirmationModal />
				<DeleteModal />
				<EditModal />
			</Stack>
		</AuctionBiddingContext.Provider>
	);
}
