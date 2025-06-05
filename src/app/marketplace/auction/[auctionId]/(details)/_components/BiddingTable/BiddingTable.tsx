'use client';

import { sortBy } from 'lodash-es';
import { DataTable } from 'mantine-datatable';
import { useFormatter } from 'next-intl';
import { Ref, useCallback, useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { ActionIcon, Button, Group, TableProps, Text } from '@mantine/core';
import { IconPencil, IconX } from '@tabler/icons-react';

import classes from './styles.module.css';
import { BiddingTableData } from './types';

export interface BiddingTableProps extends TableProps {
	readOnly?: boolean;
	displaySelectedOnly?: boolean;
	displayDeletingOnly?: boolean;
	ref?: Ref<HTMLTableElement>;
}
export const BiddingTable = ({
	readOnly = false,
	displaySelectedOnly = false,
	displayDeletingOnly = false,
	className,
	ref,
	...props
}: BiddingTableProps) => {
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
	} = useContext(AuctionDetailsPageContext);

	const bidsData = useMemo<Array<BiddingTableData>>(() => {
		let sortedData = [];
		if (displaySelectedOnly) sortedData = sortBy(selectedBids, sortStatus.columnAccessor);
		else if (displayDeletingOnly) sortedData = sortBy(deletingBids, sortStatus.columnAccessor);
		else sortedData = sortBy(bids, sortStatus.columnAccessor);
		return sortStatus.direction === 'asc' ? sortedData : sortedData.reverse();
	}, [bids, sortStatus, selectedBids, deletingBids, displaySelectedOnly, displayDeletingOnly]);

	const onDeleteHandler = useCallback(
		(bids: Array<BiddingTableData>) => {
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
			{/* @ts-expect-error - data table props from library are not exposed */}
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
				noRecordsText='No bids added yet. Use the "Insert Bids" form on the side to add bids.'
				{...(ref && { tableRef: ref })}
				{...props}
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
