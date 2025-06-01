'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useContext, useMemo, useState } from 'react';

import { generateBidsRows, generateLegend } from '@/components/BidsTable/helpers';
import { BidsFilter } from '@/components/BidsTable/types';
import { CurrentUserContext } from '@/pages/globalContext';
import { IBidData } from '@/schema/models';
import { KeysetPaginatedContextState, OffsetPaginatedContextState } from '@/types';
import {
	ActionIcon,
	Group,
	Menu,
	Radio,
	Select,
	Stack,
	Table,
	TableProps,
	TableTbody,
	TableTh,
	TableThead,
	TableTr,
	Text,
	Title,
} from '@mantine/core';
import {
	IconAdjustments,
	IconArrowNarrowDown,
	IconChevronLeft,
	IconChevronRight,
	IconX,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export interface BidsTableProps extends TableProps {
	bids: KeysetPaginatedContextState<IBidData>;
	winningBids?: OffsetPaginatedContextState<IBidData>;
	myPaginatedBids?: KeysetPaginatedContextState<IBidData>;
	contributingBidIds?: Array<string>;

	withCloseButton?: boolean;
	onClose?: () => void;
}
export const BidsTable = ({
	bids,
	winningBids,
	myPaginatedBids,
	contributingBidIds,

	withCloseButton,
	onClose,
	...props
}: BidsTableProps) => {
	const t = useTranslations();
	const { currentUser } = useContext(CurrentUserContext);

	const [bidsFilter, setBidsFilter] = useState<BidsFilter>('all');

	//	Generate the table rows
	const bidsData = useMemo(() => {
		if (!bids) return null;
		return generateBidsRows({
			bids,
			winningBids,
			myPaginatedBids,
			contributingBidIds,
			bidsFilter,
			currentUser,
		});
	}, [bids, winningBids, myPaginatedBids, contributingBidIds, bidsFilter, currentUser]);

	//	Generate the legend based on the bids filter
	const legend = useMemo(() => {
		if (!bids) return null;
		return generateLegend(bidsFilter);
	}, [bids, bidsFilter]);

	const currentContextState = useMemo(() => {
		if (bidsFilter === 'winning' && winningBids) return winningBids;
		if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids;
		return bids;
	}, [bids, winningBids, myPaginatedBids, bidsFilter]);

	const handleSetPerPage = useCallback(
		(value: string | null) => {
			bids.setPerPage(Number(value));
			if (winningBids) winningBids.setPerPage(Number(value));
			if (myPaginatedBids) myPaginatedBids.setPerPage(Number(value));
		},
		[bids, winningBids, myPaginatedBids],
	);

	const isExact = useMemo(() => {
		if (bidsFilter === 'winning' && winningBids) return true;
		if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids.data.isExact;
		return bids.data.isExact;
	}, [bidsFilter, bids.data.isExact, myPaginatedBids?.data.isExact]);

	const hasPrev = useMemo(() => {
		if (bidsFilter === 'winning' && winningBids) return winningBids.data.page > 1;
		if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids.data.hasPrev;
		return bids.data.hasPrev;
	}, [bidsFilter, bids.data.hasPrev, winningBids?.data.page, myPaginatedBids?.data.hasPrev]);

	const hasNext = useMemo(() => {
		if (bidsFilter === 'winning' && winningBids)
			return winningBids.data.page < winningBids.data.pageCount;
		if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids.data.hasNext;
		return bids.data.hasNext;
	}, [
		bidsFilter,
		bids.data.hasNext,
		winningBids?.data.page,
		winningBids?.data.pageCount,
		myPaginatedBids?.data.hasNext,
	]);

	const handlePrevPage = useCallback(() => {
		if (!hasPrev) return;
		if (bidsFilter === 'winning' && winningBids) winningBids.setPage(winningBids.data.page - 1);
		else if (bidsFilter === 'mine' && myPaginatedBids)
			myPaginatedBids.setCursor(myPaginatedBids.data.cursorForPrevPage);
		else bids.setCursor(bids.data.cursorForPrevPage);
	}, [bids, winningBids, myPaginatedBids, bidsFilter, hasPrev]);

	const handleNextPage = useCallback(() => {
		if (!hasNext) return;
		if (bidsFilter === 'winning' && winningBids) winningBids.setPage(winningBids.data.page + 1);
		else if (bidsFilter === 'mine' && myPaginatedBids)
			myPaginatedBids.setCursor(myPaginatedBids.data.cursorForNextPage);
		else bids.setCursor(bids.data.cursorForNextPage);
	}, [bids, winningBids, myPaginatedBids, bidsFilter, hasNext]);

	return (
		<Stack className={classes.root}>
			<Stack className={classes.header}>
				<Group className={classes.row}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							Bids Table
						</Title>
						<Text className={classes.subtitle}>
							Showing{' '}
							{Math.min(
								currentContextState.perPage,
								currentContextState.data.totalCount,
							)}{' '}
							{isExact ? 'of' : 'of about'} {currentContextState.data.totalCount} bids
						</Text>
					</Group>
					<Group className={classes.settings}>
						<Text className={classes.label}>Per page:</Text>
						<Select
							className={classes.dropdown}
							w={80}
							value={currentContextState.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={handleSetPerPage}
							allowDeselect={false}
						/>
						<Menu>
							<Menu.Target>
								<ActionIcon className={classes.button}>
									<IconAdjustments size={16} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Radio.Group
									label="Bids Filter"
									value={bidsFilter}
									onChange={(value) => setBidsFilter(value as BidsFilter)}
								>
									<Stack>
										<Radio value="all" label="Show all bids" />
										<Radio
											value="contributing"
											label="Only show bids contributing to your final bill"
										/>
										{winningBids && (
											<Radio value="winning" label="Only show winning bids" />
										)}
										<Radio value="mine" label="Only show your bids" />
									</Stack>
								</Radio.Group>
							</Menu.Dropdown>
						</Menu>
						{withCloseButton && (
							<ActionIcon className={classes.button} onClick={onClose}>
								<IconX size={16} />
							</ActionIcon>
						)}
					</Group>
				</Group>
				<Group className={classes.row}>
					<Group className={classes.filters}>
						<Text className={classes.label}>Filters:</Text>
					</Group>
					<Group className={classes.legend}>{legend}</Group>
				</Group>
			</Stack>
			<Table highlightOnHover {...props}>
				<TableThead>
					<TableTr>
						<TableTh>Company</TableTh>
						<TableTh className="flex items-center justify-between">
							Bid
							<IconArrowNarrowDown size={14} />
						</TableTh>
						<TableTh>Permits</TableTh>
						<TableTh>Total Bid</TableTh>
						<TableTh>Timestamp</TableTh>
					</TableTr>
				</TableThead>
				<TableTbody>{bidsData}</TableTbody>
			</Table>
			<Group className="gap-2">
				<ActionIcon
					className="size-8 border-gray-300"
					variant="outline"
					disabled={!hasPrev}
					onClick={handlePrevPage}
				>
					<IconChevronLeft size={16} />
				</ActionIcon>
				<ActionIcon
					className="size-8 border-gray-300"
					variant="outline"
					disabled={!hasNext}
					onClick={handleNextPage}
				>
					<IconChevronRight size={16} />
				</ActionIcon>
			</Group>
		</Stack>
	);
};
