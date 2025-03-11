import { sortBy } from 'lodash-es';
import { DataTable } from 'mantine-datatable';
import { useCallback, useContext, useMemo } from 'react';

import { ActionIcon, Button, Group } from '@mantine/core';
import { IconPencil, IconX } from '@tabler/icons-react';

import { AuctionBiddingContext } from './constants';
import { BidTableData } from './types';

export const BidTable = () => {
	const {
		bids,
		selectedBids,
		selectedBidsHandlers,
		deletingBidsHandlers,
		deleteModalActions,
		setEditingBid,
		editModalActions,
		sortStatus,
		setSortStatus,
	} = useContext(AuctionBiddingContext);

	const bidsData = useMemo<Array<BidTableData>>(() => {
		const sortedData = sortBy(bids, sortStatus.columnAccessor);
		return sortStatus.direction === 'asc' ? sortedData : sortedData.reverse();
	}, [bids, sortStatus]);

	const onStartDeleteBidHandler = useCallback(
		(bidIds: Array<number>) => {
			deletingBidsHandlers.setState(bidIds);
			deleteModalActions.open();
		},
		[selectedBidsHandlers, deletingBidsHandlers],
	);

	const onStartEditBidHandler = useCallback((bidId: number) => {
		setEditingBid(bidId);
		editModalActions.open();
	}, []);

	return (
		<>
			<DataTable
				columns={[
					{ accessor: 'permit', sortable: true },
					{ accessor: 'emissions', sortable: true },
					{ accessor: 'bid', sortable: true },
					{ accessor: 'subtotal', sortable: true },
					{
						accessor: 'actions',
						render: ({ bid }) => (
							<Group className="gap-2">
								<ActionIcon
									variant="transparent"
									onClick={() => onStartEditBidHandler(bid)}
								>
									<IconPencil size={16} />
								</ActionIcon>
								<ActionIcon
									variant="transparent"
									onClick={() => onStartDeleteBidHandler([bid])}
								>
									<IconX size={16} />
								</ActionIcon>
							</Group>
						),
					},
				]}
				records={bidsData}
				striped
				withRowBorders
				highlightOnHover
				sortStatus={sortStatus}
				onSortStatusChange={setSortStatus}
				selectedRecords={selectedBids}
				onSelectedRecordsChange={selectedBidsHandlers.setState}
				idAccessor="bid"
				selectionTrigger="cell"
			/>
			<Button
				disabled={selectedBids.length === 0}
				onClick={() => onStartDeleteBidHandler(selectedBids.map(({ bid }) => bid))}
			>
				Delete {selectedBids.length} Bid Items
			</Button>
		</>
	);
};
