'use client';

import { useTranslations, useFormatter } from 'next-intl';
import { useContext, useState, useEffect, useMemo } from 'react';

import { DataTable } from 'mantine-datatable';
import { ResultsTable } from '@/components/Tables/AuctionResults';
import { BidsTable } from '@/components/Tables/Bids';
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
import { useAuctionAvailability } from '@/hooks';
import { AuctionResultsPageContext } from '@/pages/marketplace/auction/[auctionId]/results/_components/Providers';
import { FloatingIndicator, Tabs } from '@mantine/core';
import { CurrencyBadge } from '@/components/Badge';
import { DateTime } from 'luxon';
import { IconAward, IconGavel, IconReportAnalytics } from '@tabler/icons-react';

import classes from './styles.module.css';
import { useListState } from '@mantine/hooks';
import { IBidData } from '@/schema/models';

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
	const [selected, setSelected] = useListState([]);

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

	const dataTableColumns = useMemo(
		() => [
			{
				accessor: 'company',
				title: t('components.bidsTable.columns.company'),
				width: 200,
				render: (record: any) => record.bidder.name,
			},
			{
				accessor: 'bid',
				title: t('components.bidsTable.columns.bid'),
				textAlign: 'right' as const,
				render: (record: any) => (
					<span className="flex items-center justify-end gap-1">
						<CurrencyBadge /> {format.number(record.amount, 'money')}
					</span>
				),
			},
			{
				accessor: 'permits',
				title: t('constants.permits.key'),
				textAlign: 'right' as const,
				render: (record: any) => format.number(record.permits),
			},
			{
				accessor: 'total',
				title: t('components.bidsTable.columns.totalBid'),
				textAlign: 'right' as const,
				render: (record: any) => (
					<span className="flex items-center justify-end gap-1">
						<CurrencyBadge /> {format.number(record.amount * record.permits, 'money')}
					</span>
				),
			},
			{
				accessor: 'timestamp',
				title: t('components.bidsTable.columns.timestamp'),
				width: 160,
				render: (record: any) => DateTime.fromISO(record.timestamp).toRelative(),
			},
		],
		[t, format],
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
				</Tabs.Panel>
			</Tabs>
			{/* --- Appended Mantine DataTable preview (legacy BidsTable retained above) --- */}
			
			<DataTable
				className={classes.table}
				withColumnBorders
				highlightOnHover
				records={bidsRecords}
				columns={dataTableColumns as any}
				fetching={loadingAll}
				idAccessor="id"
				selectedRecords={selected}
				onSelectedRecordsChange={setSelected.setState as React.Dispatch<React.SetStateAction<IBidData[]>>} // Don't focus on the type too much it's just to get rid of type errors
				noRecordsText={t('components.bidsTable.empty')}
				rowClassName={dataTableRowClassName}
			/>
		</>
	);
}
