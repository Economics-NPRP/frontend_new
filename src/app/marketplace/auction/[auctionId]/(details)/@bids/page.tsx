'use client';

import { useContext } from 'react';

import { BidsTable } from '@/components/BidsTable';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@mantine/core';

import { BidTableContext } from './constants';

export default function Bids() {
	const { winningPage, setWinningPage, minePage, setMinePage, winningBids, myBids } =
		useContext(BidTableContext);

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
					paginationType="offset"
					page={minePage}
					pageCount={myBids.pageCount}
					setPage={setMinePage}
				/>
			</TabsPanel>
		</Tabs>
	);
}
