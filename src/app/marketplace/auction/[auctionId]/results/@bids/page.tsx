'use client';

import { useContext } from 'react';

import { ResultsTable } from '@/components/AuctionResultsTable';
import { BidsTable } from '@/components/BidsTable';
import { AuctionResultsContext } from '@/pages/marketplace/auction/[auctionId]/results/constants';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';

export default function Bids() {
	const { auctionData, auctionResults, allBids } = useContext(AuctionResultsContext);

	return (
		<Tabs defaultValue={'results'}>
			<TabsList>
				<TabsTab value="results">Auction Results</TabsTab>
				<TabsTab value="all">All Bids</TabsTab>
			</TabsList>

			<TabsPanel value="results">
				<ResultsTable
					tableData={auctionResults.results}
					auctionData={auctionData}
					paginationType="offset"
				/>
			</TabsPanel>

			<TabsPanel value="all">
				<BidsTable tableData={allBids.results} paginationType="keyset" />
			</TabsPanel>
		</Tabs>
	);
}
