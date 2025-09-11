'use client';

import { useTranslations, useFormatter } from 'next-intl';
import { useContext, useState, useEffect, useMemo, useCallback } from 'react';

import { DataTable } from 'mantine-datatable';
import { ResultsTable } from '@/components/Tables/AuctionResults';
import { BidsTable, NewBidsTable } from '@/components/Tables/Bids';
import {
	AllWinningBidsContext,
	MyOpenAuctionResultsContext,
	MyPaginatedBidsContext,
	PaginatedBidsContext,
	PaginatedOpenAuctionResultsContext,
	PaginatedWinningBidsContext,
	SingleAuctionContext,
	MyUserProfileContext,
} from '@/contexts';
import { SelectionSummaryContext } from '@/components/Tables/_components/SelectionSummary';
import { useAuctionAvailability } from '@/hooks';
import { AuctionResultsPageContext } from '@/pages/marketplace/auction/[auctionId]/results/_components/Providers';
import { FloatingIndicator, Tabs, Button } from '@mantine/core';
import { CurrencyBadge } from '@/components/Badge';
import { DateTime } from 'luxon';
import { IconAward, IconGavel, IconReportAnalytics } from '@tabler/icons-react';
import { IBidData } from '@/schema/models';

import classes from './styles.module.css';
import { useListState } from '@mantine/hooks';

export default function Bids() {
	const t = useTranslations();
	const auction = useContext(SingleAuctionContext);
	const paginatedBids = useContext(PaginatedBidsContext);
	const allWinningBids = useContext(AllWinningBidsContext);
	const paginatedWinningBids = useContext(PaginatedWinningBidsContext);
	const myPaginatedBids = useContext(MyPaginatedBidsContext);
	const paginatedOpenAuctionResults = useContext(PaginatedOpenAuctionResultsContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);
	const myUser = useContext(MyUserProfileContext);
	const { historyRef } = useContext(AuctionResultsPageContext);
	const format = useFormatter();

	const { hasEnded } = useAuctionAvailability();

	const [currentTab, setCurrentTab] = useState<string | null>('results');
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
	const [selectedResult, setSelected] = useListState([]);
	const { open } = useContext(SelectionSummaryContext);

	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	useEffect(() => {
		console.log("PAGINATED RESULTS START", paginatedBids, "PAGINATED RESULTS END");
	}, [paginatedOpenAuctionResults]);

	// ------------------------------------------------------------------
	// Derived data for appended Mantine DataTable (non-destructive addition)
	// ------------------------------------------------------------------
	const contributingBidIds = useMemo(
		() => myOpenAuctionResults?.data.contributingLosingBids.map(({ id }) => id) || [],
		[myOpenAuctionResults],
	);
	const winningBidIds = useMemo(
		() => allWinningBids?.data.results.map(({ id }) => id) || [],
		[allWinningBids],
	);
	const bidsRecords = useMemo(() => paginatedBids?.data.results || [], [paginatedBids?.data.results]);
	const loadingAll = useMemo(() => 
		(auction.isLoading ||
		paginatedBids.isLoading ||
		allWinningBids.isLoading ||
		paginatedWinningBids.isLoading ||
		myPaginatedBids.isLoading ||
		myOpenAuctionResults.isLoading),
		[auction, paginatedBids, allWinningBids, paginatedWinningBids, myPaginatedBids, myOpenAuctionResults]
	);

	const dataTableRowClassName = (record: any) => {
		if (!record || record.length === 0) return 'bg-gray-50 dark:bg-dark-500';
		const isMine = record.bidder.id === myUser?.data.id;
		const isWinning = winningBidIds.includes(record.id);
		const isContributing = contributingBidIds.includes(record.id);
		const arr: string[] = [];
		if (isMine) arr.push('bg-gray-50 dark:bg-dark-500');
		if (isWinning) arr.push('outline outline-1 outline-green-500');
		if (isContributing) arr.push('outline outline-1 outline-amber-500');
		return arr.join(' ');
	};

	return (
		<>
			<a id="history" ref={historyRef} />
			<Tabs
				value={currentTab}
				onChange={setCurrentTab}
				variant="none"
				classNames={{
					root: classes.root,
					list: classes.list,
					tab: classes.tab,
					panel: classes.panel,
				}}
			>
				<Tabs.List ref={setRootRef}>
					<Tabs.Tab
						value="results"
						ref={setControlRef('results')}
						leftSection={<IconAward size={16} />}
					>
						{t('marketplace.auction.results.bids.tabs.results')}
					</Tabs.Tab>
					<Tabs.Tab
						value="all"
						ref={setControlRef('all')}
						leftSection={<IconGavel size={16} />}
					>
						{t('marketplace.auction.results.bids.tabs.bids')}
					</Tabs.Tab>

					<FloatingIndicator
						className={classes.indicator}
						target={currentTab ? controlsRefs[currentTab] : null}
						parent={rootRef}
					/>
				</Tabs.List>

				<Tabs.Panel value="results">
					<ResultsTable
						className={classes.table}
						paginatedOpenAuctionResults={paginatedOpenAuctionResults}
						auction={auction}
					/>
				</Tabs.Panel>

				<Tabs.Panel value="all">
					<BidsTable
						className={classes.table}
						bids={paginatedBids}
						allWinningBids={allWinningBids}
						paginatedWinningBids={paginatedWinningBids}
						myPaginatedBids={myPaginatedBids}
						myOpenAuctionResults={myOpenAuctionResults}
						showContributingBids={hasEnded}
						loading={loadingAll}
					/>
					<hr/>
					<NewBidsTable
						className={classes.table}
						bids={paginatedBids}
						allWinningBids={allWinningBids}
						paginatedWinningBids={paginatedWinningBids}
						myPaginatedBids={myPaginatedBids}
						myOpenAuctionResults={myOpenAuctionResults}
						showContributingBids={hasEnded}
						loading={loadingAll}
						bidsRecords={bidsRecords}
						
					/>
				</Tabs.Panel>
			</Tabs>
			{/* --- Appended Mantine DataTable preview (legacy BidsTable retained above) --- */}
			{/* <Button
				className={`${classes.secondary} ${classes.button}`}
				variant="outline"
				disabled={selectedResult.length === 0}
				rightSection={<IconReportAnalytics size={16} />}
				onClick={() =>
					open(
						selectedResult,
						generateSummaryGroups,
					)
				}
			>
				{t('components.table.selected.viewSummary')}
			</Button>
			<DataTable
				className={classes.table}
				withColumnBorders
				highlightOnHover
				records={bidsRecords}
				columns={dataTableColumns as any}
				fetching={loadingAll}
				idAccessor="id"
				selectedRecords={selectedResult}
				onSelectedRecordsChange={setSelected.setState as React.Dispatch<React.SetStateAction<IBidData[]>>} // Don't focus on the type too much it's just to get rid of type errors
				noRecordsText={t('components.bidsTable.empty')}
				rowClassName={dataTableRowClassName}
			/> */}
		</>
	);
}
