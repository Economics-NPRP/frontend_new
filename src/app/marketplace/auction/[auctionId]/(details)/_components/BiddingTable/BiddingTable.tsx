'use client';

import { sortBy } from 'lodash-es';
import { DataTable } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
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
	const t = useTranslations();
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
						title: t(
							'marketplace.auction.details.components.biddingTable.columns.permits',
						),
						render: (record) => (
							<Text>
								{t('constants.quantities.permits.unitlessWithPercentTotal', {
									value: record.permit,
									percent: (record.permit / totalPermits) * 100,
								})}
							</Text>
						),
					},
					{
						accessor: 'emissions',
						sortable: true,
						title: t(
							'marketplace.auction.details.components.biddingTable.columns.emissions',
						),
						render: (record) => (
							<Text>
								{t('constants.quantities.emissions.default', {
									value: record.emissions,
								})}
							</Text>
						),
					},
					{
						accessor: 'bid',
						sortable: true,
						title: t(
							'marketplace.auction.details.components.biddingTable.columns.bids',
						),
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
						title: t(
							'marketplace.auction.details.components.biddingTable.columns.subtotals',
						),
						render: (record) => (
							<Group className={classes.cell}>
								<CurrencyBadge />
								<Text>
									{t('constants.quantities.currency.unitlessWithPercentTotal', {
										value: record.subtotal,
										percent: (record.subtotal / grandTotal) * 100,
									})}
								</Text>
							</Group>
						),
					},
					{
						accessor: 'actions',
						hidden: readOnly,
						title: t(
							'marketplace.auction.details.components.biddingTable.columns.actions',
						),
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
				pinLastColumn={!readOnly}
				sortStatus={sortStatus}
				onSortStatusChange={setSortStatus}
				selectedRecords={!readOnly ? selectedBids : undefined}
				onSelectedRecordsChange={!readOnly ? selectedBidsHandlers.setState : undefined}
				idAccessor="bid"
				selectionTrigger="cell"
				noRecordsText={t('marketplace.auction.details.components.biddingTable.empty')}
				{...(ref && { tableRef: ref })}
				{...props}
			/>
			{!readOnly && (
				<Button
					color="red"
					disabled={selectedBids.length === 0}
					onClick={() => onDeleteHandler(selectedBids)}
				>
					{t('marketplace.auction.details.components.biddingTable.delete', {
						value: selectedBids.length,
					})}
				</Button>
			)}
		</>
	);
};
