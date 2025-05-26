'use client';

import { useContext, useMemo, useState } from 'react';

import { ResultsTable } from '@/components/AuctionResultsTable';
import { BidsTable } from '@/components/BidsTable';
import { AuctionResultsContext } from '@/pages/marketplace/auction/[auctionId]/results/constants';
import {
	Container,
	Group,
	Radio,
	Stack,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	Text,
} from '@mantine/core';

type BidsFilter = 'all' | 'contributing' | 'winning' | 'mine';

export default function Bids() {
	const { auctionData, openAuctionResults, allBids, allWinningBids, myOpenAuctionResults } =
		useContext(AuctionResultsContext);

	const [bidsFilter, setBidsFilter] = useState<BidsFilter>('all');

	const allBidsTableData = useMemo(() => {
		if (bidsFilter === 'contributing') return myOpenAuctionResults.contributingLosingBids;
		return allBids.results;
	}, [bidsFilter, allBids.results, myOpenAuctionResults.contributingLosingBids]);

	return (
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
				<ResultsTable
					tableData={openAuctionResults.results}
					auctionData={auctionData}
					paginationType="offset"
				/>
			</TabsPanel>

			<TabsPanel value="all">
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
						<Radio value="winning" label="Only show winning bids" />
						<Radio value="mine" label="Only show your bids" />
					</Stack>
				</Radio.Group>
				<Group className="gap-4 py-4">
					<Group className="gap-2">
						<Container className="size-4 bg-blue-100 rounded-sm border border-solid border-blue-300" />
						<Text className="paragraph-xs">Contributing Bids</Text>
					</Group>
					<Group className="gap-2">
						<Container className="size-4 bg-yellow-100 rounded-sm border border-solid border-yellow-300" />
						<Text className="paragraph-xs">Winning Bids</Text>
					</Group>
					<Group className="gap-2">
						<Container className="size-4 bg-gray-100 rounded-sm border border-solid border-gray-300" />
						<Text className="paragraph-xs">Your Bids</Text>
					</Group>
				</Group>
				<BidsTable
					tableData={allBidsTableData}
					winningBidIds={allWinningBids.results.map((bid) => bid.id)}
					contributingBidIds={myOpenAuctionResults.contributingLosingBids.map(
						(bid) => bid.id,
					)}
					paginationType="keyset"
				/>
			</TabsPanel>
		</Tabs>
	);
}
