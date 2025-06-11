'use client';

import { useContext, useState } from 'react';

import { ResultsTable } from '@/components/AuctionResultsTable';
import { BidsTable } from '@/components/BidsTable';
import {
	AllWinningBidsContext,
	MyOpenAuctionResultsContext,
	MyPaginatedBidsContext,
	PaginatedBidsContext,
	PaginatedOpenAuctionResultsContext,
	PaginatedWinningBidsContext,
	SingleAuctionContext,
} from '@/contexts';
import { AuctionResultsPageContext } from '@/pages/marketplace/auction/[auctionId]/results/constants';
import { Container, FloatingIndicator, Group, Select, Tabs, Text } from '@mantine/core';
import { IconGavel, IconTrophy } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Bids() {
	const auction = useContext(SingleAuctionContext);
	const paginatedBids = useContext(PaginatedBidsContext);
	const allWinningBids = useContext(AllWinningBidsContext);
	const paginatedWinningBids = useContext(PaginatedWinningBidsContext);
	const myPaginatedBids = useContext(MyPaginatedBidsContext);
	const paginatedOpenAuctionResults = useContext(PaginatedOpenAuctionResultsContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);
	const { historyRef } = useContext(AuctionResultsPageContext);

	const [currentTab, setCurrentTab] = useState<string | null>('results');
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
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
						leftSection={<IconTrophy size={16} />}
					>
						Auction Results
					</Tabs.Tab>
					<Tabs.Tab
						value="all"
						ref={setControlRef('all')}
						leftSection={<IconGavel size={16} />}
					>
						All Bids
					</Tabs.Tab>

					<FloatingIndicator
						className={classes.indicator}
						target={currentTab ? controlsRefs[currentTab] : null}
						parent={rootRef}
					/>
				</Tabs.List>

				<Tabs.Panel value="results">
					<Group className="gap-4 py-4">
						<Group className="gap-2">
							<Container className="size-4 bg-gray-100 rounded-sm border border-solid border-gray-300" />
							<Text className="paragraph-xs">Your Bids</Text>
						</Group>
					</Group>
					<Text className="paragraph-sm">Per page:</Text>
					<Select
						w={80}
						value={paginatedOpenAuctionResults.perPage.toString()}
						data={['10', '20', '50', '100']}
						onChange={(value) => paginatedOpenAuctionResults.setPerPage(Number(value))}
					/>
					<Text className="paragraph-sm">
						Total Results: {paginatedOpenAuctionResults.data.totalCount}
					</Text>
					<ResultsTable
						paginatedOpenAuctionResults={paginatedOpenAuctionResults}
						auction={auction}
					/>
				</Tabs.Panel>

				<Tabs.Panel value="all">
					<BidsTable
						bids={paginatedBids}
						allWinningBids={allWinningBids}
						paginatedWinningBids={paginatedWinningBids}
						myPaginatedBids={myPaginatedBids}
						myOpenAuctionResults={myOpenAuctionResults}
					/>
				</Tabs.Panel>
			</Tabs>
		</>
	);
}
