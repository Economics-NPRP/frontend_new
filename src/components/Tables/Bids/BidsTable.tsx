'use client';

// import { useTranslations } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Switch } from '@/components/SwitchCase';
import { generateBidsRows, generateLegend } from '@/components/Tables/Bids/helpers';
import { BidsFilter } from '@/components/Tables/Bids/types';
import {
	IAllWinningBidsContext,
	IMyOpenAuctionResultsContext,
	IMyPaginatedBidsContext,
	IPaginatedBidsContext,
	IPaginatedWinningBidsContext,
	MyUserContext,
} from '@/contexts';
import {
	ActionIcon,
	Button,
	Container,
	Divider,
	Group,
	Loader,
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
	IconError404,
	IconX,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface BidsTableProps extends TableProps {
	bids: IPaginatedBidsContext;
	allWinningBids?: IAllWinningBidsContext;
	paginatedWinningBids?: IPaginatedWinningBidsContext;
	myPaginatedBids?: IMyPaginatedBidsContext;
	myOpenAuctionResults?: IMyOpenAuctionResultsContext;

	showContributingBids?: boolean;

	loading?: boolean;
	unavailable?: boolean;

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

	showContributingBids,

	loading = false,
	unavailable = false,

	withCloseButton,
	onClose,

	hideHeader,

	withViewAllButton,
	onViewAll,

	className,
	...props
}: BidsTableProps) => {
	const t = useTranslations();
	const tableContainerRef = useRef<HTMLDivElement>(null);
	const myUser = useContext(MyUserContext);

	const [bidsFilter, setBidsFilter] = useState<BidsFilter>('all');

	//	Generate the table rows
	const tableData = useMemo(() => {
		if (!bids) return null;
		return generateBidsRows({
			bids,
			allWinningBids,
			paginatedWinningBids,
			myPaginatedBids,
			myOpenAuctionResults,
			bidsFilter,
			myUser,
		});
	}, [
		bids,
		allWinningBids,
		paginatedWinningBids,
		myPaginatedBids,
		myOpenAuctionResults,
		bidsFilter,
		myUser,
	]);

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!bids) return null;
		if (bidsFilter === 'all')
			return (
				<Pill className={classes.badge}>
					{t('components.bidsTable.filters.badges.all')}
				</Pill>
			);
		if (bidsFilter === 'winning')
			return (
				<Pill
					className={classes.badge}
					onRemove={() => setBidsFilter('all')}
					withRemoveButton
				>
					{t('components.bidsTable.filters.badges.winning')}
				</Pill>
			);
		if (bidsFilter === 'mine')
			return (
				<Pill
					className={classes.badge}
					onRemove={() => setBidsFilter('all')}
					withRemoveButton
				>
					{t('components.bidsTable.filters.badges.mine')}
				</Pill>
			);
		if (bidsFilter === 'contributing')
			return (
				<Pill
					className={classes.badge}
					onRemove={() => setBidsFilter('all')}
					withRemoveButton
				>
					{t('components.bidsTable.filters.badges.contributing')}
				</Pill>
			);
	}, [bids, bidsFilter]);

	//	Generate the legend based on the bids filter
	const legend = useMemo(() => {
		if (!bids) return null;
		return generateLegend(t, bidsFilter, showContributingBids);
	}, [bids, t, bidsFilter, showContributingBids]);

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

	const currentState = useMemo(() => {
		if (!tableData && loading) return 'loading';
		if (unavailable) return 'unavailable';
		if (!tableData || tableData.length === 0) return 'empty';
		return 'ok';
	}, [loading, tableData]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			{!hideHeader && (
				<Stack className={classes.header}>
					<Group className={classes.row}>
						<Group className={classes.label}>
							<Title order={2} className={classes.title}>
								{t('components.bidsTable.title')}
							</Title>
							<Text className={classes.subtitle}>
								{t('constants.pagination.keyset.bids', {
									count: Math.min(
										currentContextState.perPage,
										currentContextState.data.totalCount,
									),
									isExact,
									total: currentContextState.data.totalCount,
								})}
							</Text>
						</Group>
						<Group className={classes.settings}>
							<Text className={classes.label}>
								{t('constants.pagination.perPage.label')}
							</Text>
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
										label={t('components.bidsTable.filters.menu.title')}
										value={bidsFilter}
										onChange={(value) => setBidsFilter(value as BidsFilter)}
									>
										<Stack className={classes.options}>
											<Radio
												value="all"
												label={t(
													'components.bidsTable.filters.menu.options.all',
												)}
											/>
											{showContributingBids && (
												<Radio
													value="contributing"
													label={t(
														'components.bidsTable.filters.menu.options.contributing',
													)}
												/>
											)}
											{paginatedWinningBids && (
												<Radio
													value="winning"
													label={t(
														'components.bidsTable.filters.menu.options.winning',
													)}
												/>
											)}
											<Radio
												value="mine"
												label={t(
													'components.bidsTable.filters.menu.options.mine',
												)}
											/>
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
					<Group className={`${classes.row} ${classes.wrapMobile}`}>
						<Group className={classes.filters}>
							<Text className={classes.label}>
								{t('components.bidsTable.filters.label')}
							</Text>
							<Group className={classes.group}>{filterBadges}</Group>
						</Group>
						<Group className={classes.legend}>{legend}</Group>
					</Group>
				</Stack>
			)}
			<Stack className={classes.table} ref={tableContainerRef}>
				<Table highlightOnHover withColumnBorders stickyHeader {...props}>
					<Table.Thead>
						<Table.Tr>
							<Table.Th className="min-w-[120px]">
								{t('components.bidsTable.columns.company')}
							</Table.Th>
							<Table.Th className="min-w-[160px] flex items-center justify-between">
								{t('components.bidsTable.columns.bid')}
								<IconArrowNarrowDown size={14} />
							</Table.Th>
							<Table.Th className="min-w-[80px]">
								{t('constants.permits.key')}
							</Table.Th>
							<Table.Th className="min-w-[160px]">
								{t('components.bidsTable.columns.totalBid')}
							</Table.Th>
							<Table.Th className="min-w-[120px]">
								{t('components.bidsTable.columns.timestamp')}
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{tableData}</Table.Tbody>
				</Table>
				<Switch value={currentState}>
					<Switch.Loading>
						<Stack className={classes.placeholder}>
							<Loader color="gray" />
						</Stack>
					</Switch.Loading>
					<Switch.Case when="unavailable">
						<Stack className={classes.placeholder}>
							<Container className={classes.icon}>
								<IconError404 size={28} />
							</Container>
							<Text className={classes.text}>
								{t('components.bidsTable.sealed.unavailable')}
							</Text>
						</Stack>
					</Switch.Case>
					<Switch.Case when="empty">
						<Stack className={classes.placeholder}>
							<Container className={classes.icon}>
								<IconDatabaseOff size={24} />
							</Container>
							<Text className={classes.text}>{t('components.bidsTable.empty')}</Text>
						</Stack>
					</Switch.Case>
				</Switch>
			</Stack>
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
							<Button
								className={classes.button}
								variant="outline"
								onClick={onViewAll}
							>
								{t('constants.view.allBids.label')}
							</Button>
						</Group>
					) : (
						<Group className={classes.legend}>{legend}</Group>
					))}
			</Group>
		</Stack>
	);
};
