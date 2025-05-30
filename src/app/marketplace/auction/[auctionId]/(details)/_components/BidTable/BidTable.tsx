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
}
export const BidTable = ({ readOnly = false, className }: BidTableProps) => {
	const format = useFormatter();
	const {
		bids,
		totalPermits,
		grandTotal,
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

	const onDeleteHandler = useCallback(
		(bidIds: Array<number>) => {
			deletingBidsHandlers.setState(bidIds);
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
								{format.number(
									Math.round((record.permit / totalPermits) * 100),
									'money',
								)}
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
									{format.number(
										Math.round((record.subtotal / grandTotal) * 100),
										'money',
									)}
									%)
								</Text>
							</Group>
						),
					},
					{
						accessor: 'actions',
						hidden: readOnly,
						cellsClassName: classes.actions,
						render: ({ bid }) => (
							<Group className={classes.cell}>
								<ActionIcon
									className={classes.button}
									variant="filled"
									onClick={() => onEditHandler(bid)}
								>
									<IconPencil size={16} />
								</ActionIcon>
								<ActionIcon
									className={`${classes.delete} ${classes.button}`}
									variant="filled"
									onClick={() => onDeleteHandler([bid])}
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
					onClick={() => onDeleteHandler(selectedBids.map(({ bid }) => bid))}
				>
					Delete {selectedBids.length} Bid Items
				</Button>
			)}
		</>
	);
};
