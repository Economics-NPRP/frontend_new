'use client';

import { sortBy } from 'lodash-es';
import { DataTable } from 'mantine-datatable';
import { useFormatter } from 'next-intl';
import { useCallback, useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { AuctionBiddingContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { ActionIcon, Button, Group, TableProps, Text } from '@mantine/core';
import { IconPencil, IconX } from '@tabler/icons-react';

import classes from './styles.module.css';
import { BidTableData } from './types';

export interface BidTableProps extends TableProps {
	readOnly?: boolean;
	displaySelectedOnly?: boolean;
	displayDeletingOnly?: boolean;
}
export const BidTable = ({
	readOnly = false,
	displaySelectedOnly = false,
	displayDeletingOnly = false,
	className,
}: BidTableProps) => {
	const format = useFormatter();
	const {
		bids,
		totalPermits,
		grandTotal,
		selectedBids,
		selectedBidsHandlers,
		deletingBids,
		deletingBidsHandlers,
		deleteModalActions,
		setEditingBid,
		editModalActions,
		sortStatus,
		setSortStatus,
	} = useContext(AuctionBiddingContext);

	const bidsData = useMemo<Array<BidTableData>>(() => {
		let sortedData = [];
		if (displaySelectedOnly) sortedData = sortBy(selectedBids, sortStatus.columnAccessor);
		else if (displayDeletingOnly) sortedData = sortBy(deletingBids, sortStatus.columnAccessor);
		else sortedData = sortBy(bids, sortStatus.columnAccessor);
		return sortStatus.direction === 'asc' ? sortedData : sortedData.reverse();
	}, [bids, sortStatus, selectedBids, deletingBids, displaySelectedOnly, displayDeletingOnly]);

	const onDeleteHandler = useCallback(
		(bids: Array<BidTableData>) => {
			deletingBidsHandlers.setState(bids);
			deleteModalActions.open();
		},
		[selectedBidsHandlers, deletingBidsHandlers],
	);

	const onEditHandler = useCallback((bidId: number) => {
		setEditingBid(bidId);
		editModalActions.open();
	}, []);

	return (
		<>
			<DataTable
				className={`${classes.root} ${className}`}
				columns={[
					{
						accessor: 'permit',
						sortable: true,
						title: 'Permits (% of Total)',
						render: (record) => (
							<Text>
								{format.number(record.permit)} (
								{format.number((record.permit / totalPermits) * 100, 'money')}
								%)
							</Text>
						),
					},
					{
						accessor: 'emissions',
						sortable: true,
						render: (record) => <Text>{format.number(record.emissions)} tCO2e</Text>,
					},
					{
						accessor: 'bid',
						sortable: true,
						title: 'Price/Permit',
						render: (record) => (
							<Group className={classes.cell}>
								<CurrencyBadge />
								<Text>{format.number(record.bid, 'money')}</Text>
							</Group>
						),
					},
					{
						accessor: 'subtotal',
						sortable: true,
						title: 'Subtotal (% of Total)',
						render: (record) => (
							<Group className={classes.cell}>
								<CurrencyBadge />
								<Text>
									{format.number(record.subtotal, 'money')} (
									{format.number((record.subtotal / grandTotal) * 100, 'money')}
									%)
								</Text>
							</Group>
						),
					},
					{
						accessor: 'actions',
						hidden: readOnly,
						cellsClassName: classes.actions,
						width: 81,
						render: (bidItem) => (
							<Group className={classes.cell}>
								<ActionIcon
									className={classes.button}
									variant="filled"
									onClick={() => onEditHandler(bidItem.bid)}
								>
									<IconPencil size={16} />
								</ActionIcon>
								<ActionIcon
									className={`${classes.delete} ${classes.button}`}
									variant="filled"
									onClick={() => onDeleteHandler([bidItem])}
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
				withColumnBorders
				highlightOnHover
				sortStatus={sortStatus}
				onSortStatusChange={setSortStatus}
				selectedRecords={!readOnly ? selectedBids : undefined}
				onSelectedRecordsChange={!readOnly ? selectedBidsHandlers.setState : undefined}
				idAccessor="bid"
				selectionTrigger="cell"
			/>
			{!readOnly && (
				<Button
					color="red"
					disabled={selectedBids.length === 0}
					onClick={() => onDeleteHandler(selectedBids)}
				>
					Delete {selectedBids.length} Bid Items
				</Button>
			)}
		</>
	);
};
