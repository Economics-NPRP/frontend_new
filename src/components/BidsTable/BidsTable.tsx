'use client';

// import { useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { generateBidsRows, generateLegend } from '@/components/BidsTable/helpers';
import { BidsFilter } from '@/components/BidsTable/types';
import {
	IAllWinningBidsContext,
	IMyOpenAuctionResultsContext,
	IMyPaginatedBidsContext,
	IPaginatedBidsContext,
	IPaginatedWinningBidsContext,
} from '@/contexts';
import { CurrentUserContext } from '@/pages/globalContext';
import {
	ActionIcon,
	Button,
	Container,
	Divider,
	Group,
	Menu,
	Pill,
	Radio,
	Select,
	Stack,
	Table,
	TableProps,
	Text,
	Title,
} from '@mantine/core';
import {
	IconAdjustments,
	IconArrowNarrowDown,
	IconChevronLeft,
	IconChevronRight,
	IconDatabaseOff,
	IconX,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export interface BidsTableProps extends TableProps {
	bids: IPaginatedBidsContext;
	allWinningBids?: IAllWinningBidsContext;
	paginatedWinningBids?: IPaginatedWinningBidsContext;
	myPaginatedBids?: IMyPaginatedBidsContext;
	myOpenAuctionResults?: IMyOpenAuctionResultsContext;

	withCloseButton?: boolean;
	onClose?: () => void;

	hideHeader?: boolean;

	withViewAllButton?: boolean;
	onViewAll?: () => void;
}
export const BidsTable = ({
	bids,
	allWinningBids,
	paginatedWinningBids,
	myPaginatedBids,
	myOpenAuctionResults,

	withCloseButton,
	onClose,

	hideHeader,

	withViewAllButton,
	onViewAll,

	className,
	...props
}: BidsTableProps) => {
	// const t = useTranslations();
	const tableContainerRef = useRef<HTMLDivElement>(null);
	const { currentUser } = useContext(CurrentUserContext);

	const [bidsFilter, setBidsFilter] = useState<BidsFilter>('all');

	//	Generate the table rows
	const bidsData = useMemo(() => {
		if (!bids) return null;
		return generateBidsRows({
			bids,
			allWinningBids,
			paginatedWinningBids,
			myPaginatedBids,
			myOpenAuctionResults,
			bidsFilter,
			currentUser,
		});
	}, [
		bids,
		allWinningBids,
		paginatedWinningBids,
		myPaginatedBids,
		myOpenAuctionResults,
		bidsFilter,
		currentUser,
	]);

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!bids) return null;
		if (bidsFilter === 'all') return <Pill>No Filter Applied</Pill>;
		if (bidsFilter === 'winning')
			return (
				<Pill onRemove={() => setBidsFilter('all')} withRemoveButton>
					Winning Bids Only
				</Pill>
			);
		if (bidsFilter === 'mine')
			return (
				<Pill onRemove={() => setBidsFilter('all')} withRemoveButton>
					My Bids Only
				</Pill>
			);
	}, [bids, bidsFilter]);

	//	Generate the legend based on the bids filter
	const legend = useMemo(() => {
		if (!bids) return null;
		return generateLegend(bidsFilter);
	}, [bids, bidsFilter]);

	const currentContextState = useMemo(() => {
		if (bidsFilter === 'winning' && paginatedWinningBids) return paginatedWinningBids;
		if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids;
		return bids;
	}, [bids, paginatedWinningBids, myPaginatedBids, bidsFilter]);

	const handleSetPerPage = useCallback(
		(value: string | null) => {
			bids.setPerPage(Number(value));
			if (paginatedWinningBids) paginatedWinningBids.setPerPage(Number(value));
			if (myPaginatedBids) myPaginatedBids.setPerPage(Number(value));
		},
		[bids, paginatedWinningBids, myPaginatedBids],
	);

	const isExact = useMemo(() => {
		if (bidsFilter === 'winning' && paginatedWinningBids) return true;
		if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids.data.isExact;
		return bids.data.isExact;
	}, [bidsFilter, bids.data.isExact, myPaginatedBids?.data.isExact]);

	const hasPrev = useMemo(() => {
		if (bidsFilter === 'winning' && paginatedWinningBids)
			return paginatedWinningBids.data.page > 1;
		if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids.data.hasPrev;
		return bids.data.hasPrev;
	}, [
		bidsFilter,
		bids.data.hasPrev,
		paginatedWinningBids?.data.page,
		myPaginatedBids?.data.hasPrev,
	]);

	const hasNext = useMemo(() => {
		if (bidsFilter === 'winning' && paginatedWinningBids)
			return paginatedWinningBids.data.page < paginatedWinningBids.data.pageCount;
		if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids.data.hasNext;
		return bids.data.hasNext;
	}, [
		bidsFilter,
		bids.data.hasNext,
		paginatedWinningBids?.data.page,
		paginatedWinningBids?.data.pageCount,
		myPaginatedBids?.data.hasNext,
	]);

	const handlePrevPage = useCallback(() => {
		if (!hasPrev) return;
		tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

		if (bidsFilter === 'winning' && paginatedWinningBids)
			paginatedWinningBids.setPage(paginatedWinningBids.data.page - 1);
		else if (bidsFilter === 'mine' && myPaginatedBids)
			myPaginatedBids.setCursor(myPaginatedBids.data.cursorForPrevPage);
		else bids.setCursor(bids.data.cursorForPrevPage);
	}, [bids, paginatedWinningBids, myPaginatedBids, bidsFilter, hasPrev]);

	const handleNextPage = useCallback(() => {
		if (!hasNext) return;
		tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

		if (bidsFilter === 'winning' && paginatedWinningBids)
			paginatedWinningBids.setPage(paginatedWinningBids.data.page + 1);
		else if (bidsFilter === 'mine' && myPaginatedBids)
			myPaginatedBids.setCursor(myPaginatedBids.data.cursorForNextPage);
		else bids.setCursor(bids.data.cursorForNextPage);
	}, [bids, paginatedWinningBids, myPaginatedBids, bidsFilter, hasNext]);

	//	Reset the page when the bids filter or per page changes
	useEffect(() => {
		bids.setCursor(null);
		if (paginatedWinningBids) paginatedWinningBids.setPage(1);
		if (myPaginatedBids) myPaginatedBids.setCursor(null);
	}, [bidsFilter, bids.perPage, paginatedWinningBids?.perPage, myPaginatedBids?.perPage]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			{!hideHeader && (
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
								{isExact ? 'of' : 'of about'} {currentContextState.data.totalCount}{' '}
								bids
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
							<Menu position="bottom-end">
								<Menu.Target>
									<ActionIcon className={classes.button}>
										<IconAdjustments size={16} />
									</ActionIcon>
								</Menu.Target>
								<Menu.Dropdown className={classes.filterMenu}>
									<Radio.Group
										classNames={{ label: classes.label }}
										label="Bids Filter"
										value={bidsFilter}
										onChange={(value) => setBidsFilter(value as BidsFilter)}
									>
										<Stack className={classes.options}>
											<Radio value="all" label="Show all bids" />
											<Radio
												value="contributing"
												label="Only show bids contributing to your final bill"
											/>
											{paginatedWinningBids && (
												<Radio
													value="winning"
													label="Only show winning bids"
												/>
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
							<Group className={classes.badges}>{filterBadges}</Group>
						</Group>
						<Group className={classes.legend}>{legend}</Group>
					</Group>
				</Stack>
			)}
			<Container className={classes.table} ref={tableContainerRef}>
				<Table highlightOnHover withColumnBorders stickyHeader {...props}>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Company</Table.Th>
							<Table.Th className="flex items-center justify-between">
								Bid
								<IconArrowNarrowDown size={14} />
							</Table.Th>
							<Table.Th>Permits</Table.Th>
							<Table.Th>Total Bid</Table.Th>
							<Table.Th>Timestamp</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{bidsData}</Table.Tbody>
				</Table>
				{(!bidsData || bidsData.length === 0) && (
					<Stack className={classes.empty}>
						<Container className={classes.icon}>
							<IconDatabaseOff size={24} />
						</Container>
						<Text className={classes.text}>No bids found</Text>
					</Stack>
				)}
			</Container>
			<Group className={classes.footer}>
				<Group className={classes.pagination}>
					<ActionIcon
						className={classes.button}
						variant="outline"
						disabled={!hasPrev}
						onClick={handlePrevPage}
					>
						<IconChevronLeft size={16} />
					</ActionIcon>
					<ActionIcon
						className={classes.button}
						variant="outline"
						disabled={!hasNext}
						onClick={handleNextPage}
					>
						<IconChevronRight size={16} />
					</ActionIcon>
				</Group>
				{hideHeader &&
					(withViewAllButton ? (
						<Group className={classes.row}>
							<Group className={classes.legend}>{legend}</Group>
							<Divider orientation="vertical" />
							<Button variant="outline" onClick={onViewAll}>
								View All Bids
							</Button>
						</Group>
					) : (
						<Group className={classes.legend}>{legend}</Group>
					))}
			</Group>
		</Stack>
	);
};
