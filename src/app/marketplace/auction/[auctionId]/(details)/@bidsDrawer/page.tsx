'use client';

import { useContext } from 'react';

import { BidsTable } from '@/components/BidsTable';
import { AuctionBidsContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';

export default function Bids() {
	const { winningPage, setWinningPage, minePage, setMinePage, winningBids, myBids } =
		useContext(AuctionBidsContext);

	return (
		<Tabs defaultValue={'winning'}>
			<TabsList>
				<TabsTab value="winning">Current Winning Bids</TabsTab>
				<TabsTab value="mine">Your Submitted Bids</TabsTab>
			</TabsList>

			<TabsPanel value="winning">
				<BidsTable
					tableData={winningBids.results}
					paginationType="offset"
					page={winningPage}
					pageCount={winningBids.pageCount}
					setPage={setWinningPage}
				/>
			</TabsPanel>

			<TabsPanel value="mine">
				<BidsTable
					tableData={myBids.results}
					winningBidIds={winningBids.results.map((bid) => bid.id)}
					paginationType="offset"
					page={minePage}
					pageCount={myBids.pageCount}
					setPage={setMinePage}
				/>
			</TabsPanel>
		</Tabs>
	);
}
