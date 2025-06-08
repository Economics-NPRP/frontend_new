'use client';

import { useContext } from 'react';

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
import { Container, Group, Select, Tabs, TabsList, TabsPanel, TabsTab, Text } from '@mantine/core';

export default function Bids() {
	const auction = useContext(SingleAuctionContext);
	const paginatedBids = useContext(PaginatedBidsContext);
	const allWinningBids = useContext(AllWinningBidsContext);
	const paginatedWinningBids = useContext(PaginatedWinningBidsContext);
	const myPaginatedBids = useContext(MyPaginatedBidsContext);
	const paginatedOpenAuctionResults = useContext(PaginatedOpenAuctionResultsContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);
	const { historyRef } = useContext(AuctionResultsPageContext);

	return (
		<>
			<a id="history" ref={historyRef} />
			<Tabs defaultValue={'results'}>
				<TabsList>
					<TabsTab value="results">Auction Results</TabsTab>
					<TabsTab value="all">All Bids</TabsTab>
				</TabsList>

				<TabsPanel value="results">
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
				</TabsPanel>

				<TabsPanel value="all">
					<BidsTable
						bids={paginatedBids}
						allWinningBids={allWinningBids}
						paginatedWinningBids={paginatedWinningBids}
						myPaginatedBids={myPaginatedBids}
						myOpenAuctionResults={myOpenAuctionResults}
					/>
				</TabsPanel>
			</Tabs>
		</>
	);
}
