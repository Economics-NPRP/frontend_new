'use client';

import { useContext, useMemo, useState } from 'react';

import { ResultsTable } from '@/components/AuctionResultsTable';
import { BidsTable } from '@/components/BidsTable';
import { AuctionResultsContext } from '@/pages/marketplace/auction/[auctionId]/results/constants';
import {
	Container,
	Group,
	Radio,
	Select,
	Stack,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	Text,
} from '@mantine/core';

type BidsFilter = 'all' | 'contributing' | 'winning' | 'mine';

export default function Bids() {
	const {
		historyRef,
		resultsPage,
		setResultsPage,
		winningBidsPage,
		setWinningBidsPage,
		resultsPerPage,
		setResultsPerPage,
		bidsPerPage,
		setBidsPerPage,
		auctionData,
		openAuctionResults,
		allBids,
		myBids,
		winningBids,
		allWinningBids,
		myOpenAuctionResults,
	} = useContext(AuctionResultsContext);

	const [bidsFilter, setBidsFilter] = useState<BidsFilter>('all');

	const bidsTableData = useMemo(() => {
		if (bidsFilter === 'contributing') return myOpenAuctionResults.contributingLosingBids;
		if (bidsFilter === 'winning') return winningBids.results;
		if (bidsFilter === 'mine') return myBids.results;
		return allBids.results;
	}, [bidsFilter, allBids, myOpenAuctionResults, winningBids, myBids]);

	const totalBidsCount = useMemo(() => {
		if (bidsFilter === 'contributing')
			return myOpenAuctionResults.contributingLosingBids.length;
		if (bidsFilter === 'winning') return winningBids.totalCount;
		if (bidsFilter === 'mine') return myBids.totalCount;
		return allBids.totalCount;
	}, [bidsFilter, allBids, myOpenAuctionResults, winningBids, myBids]);

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
						value={resultsPerPage.toString()}
						data={['10', '20', '50', '100']}
						onChange={(value) => setResultsPerPage(Number(value))}
					/>
					<Text className="paragraph-sm">
						Total Results: {openAuctionResults.totalCount}
					</Text>
					<ResultsTable
						tableData={openAuctionResults.results}
						auctionData={auctionData}
						paginationType="offset"
						page={resultsPage}
						pageCount={openAuctionResults.pageCount}
						setPage={setResultsPage}
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
					<Text className="paragraph-sm">Per page:</Text>
					<Select
						w={80}
						value={bidsPerPage.toString()}
						data={['10', '20', '50', '100']}
						onChange={(value) => setBidsPerPage(Number(value))}
					/>
					<Text className="paragraph-sm">Total Bids: {totalBidsCount}</Text>
					<BidsTable
						tableData={bidsTableData}
						winningBidIds={allWinningBids.results.map((bid) => bid.id)}
						contributingBidIds={myOpenAuctionResults.contributingLosingBids.map(
							(bid) => bid.id,
						)}
						paginationType={bidsFilter === 'winning' ? 'offset' : 'keyset'}
						page={bidsFilter === 'winning' ? winningBidsPage : undefined}
						pageCount={bidsFilter === 'winning' ? winningBids.pageCount : undefined}
						setPage={bidsFilter === 'winning' ? setWinningBidsPage : undefined}
					/>
				</TabsPanel>
			</Tabs>
		</>
	);
}
