'use client';

import { useTranslations } from 'next-intl';
import { useContext, useState, useEffect } from 'react';

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
} from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { AuctionResultsPageContext } from '@/pages/marketplace/auction/[auctionId]/results/_components/Providers';
import { FloatingIndicator, Tabs } from '@mantine/core';
import { IconAward, IconGavel, IconReportAnalytics } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Bids() {
	const t = useTranslations();
	const auction = useContext(SingleAuctionContext);
	const paginatedBids = useContext(PaginatedBidsContext);
	const allWinningBids = useContext(AllWinningBidsContext);
	const paginatedWinningBids = useContext(PaginatedWinningBidsContext);
	const myPaginatedBids = useContext(MyPaginatedBidsContext);
	const paginatedOpenAuctionResults = useContext(PaginatedOpenAuctionResultsContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);
	const { historyRef } = useContext(AuctionResultsPageContext);

	const { hasEnded } = useAuctionAvailability();

	const [currentTab, setCurrentTab] = useState<string | null>('results');
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
	
	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	useEffect(() => {
		console.log(paginatedOpenAuctionResults)
	}, [paginatedOpenAuctionResults]);

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
						loading={
							auction.isLoading ||
							paginatedBids.isLoading ||
							allWinningBids.isLoading ||
							paginatedWinningBids.isLoading ||
							myPaginatedBids.isLoading ||
							myOpenAuctionResults.isLoading
						}
					/>
					<DataTable 
						
					/>
				</Tabs.Panel>
			</Tabs>
		</>
	);
}
