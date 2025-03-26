'use client';

import { useParams } from 'next/navigation';
import { ReactNode, useState } from 'react';

import { getSingleAuction } from '@/lib/auctions';
import { getMyPaginatedBids, getPaginatedWinningBids } from '@/lib/bids/open';
import { Stack } from '@mantine/core';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
	DEFAULT_CONTEXT as BID_TABLE_DEFAULT_CONTEXT,
	BidTableContext,
} from '../(details)/@bids/constants';
import Bids from '../(details)/@bids/page';
import {
	DEFAULT_CONTEXT as AUCTION_RESULTS_DEFAULT_CONTEXT,
	AuctionResultsContext,
} from './constants';

export interface AuctionResultsProps {
	ticket: ReactNode;
}
export default function AuctionResults({ ticket }: AuctionResultsProps) {
	const { auctionId } = useParams();

	const [winningPage, setWinningPage] = useState(1);
	const [minePage, setMinePage] = useState(1);

	const {
		data: auctionData,
		isLoading: isAuctionDataLoading,
		isError: isAuctionDataError,
		isSuccess: isAuctionDataSuccess,
	} = useQuery({
		queryKey: ['marketplace', '@catalogue', 'auctionData', auctionId],
		queryFn: () => getSingleAuction(auctionId as string),
		placeholderData: keepPreviousData,
	});

	const {
		data: winningBids,
		isLoading: isWinningBidsLoading,
		isError: isWinningBidsError,
		isSuccess: isWinningBidsSuccess,
	} = useQuery({
		queryKey: ['marketplace', '@catalogue', 'winningBids', auctionId, winningPage],
		queryFn: () =>
			getPaginatedWinningBids({
				auctionId: auctionId as string,
				page: winningPage,
				perPage: 10,
			}),
		placeholderData: keepPreviousData,
	});

	const {
		data: myBids,
		isLoading: isMyBidsLoading,
		isError: isMyBidsError,
		isSuccess: isMyBidsSuccess,
	} = useQuery({
		queryKey: ['marketplace', '@catalogue', 'myBids', auctionId, winningPage],
		queryFn: () =>
			getMyPaginatedBids({
				auctionId: auctionId as string,
				page: minePage,
				perPage: 10,
			}),
		placeholderData: keepPreviousData,
	});

	return (
		<AuctionResultsContext.Provider
			value={{
				auctionData: auctionData || AUCTION_RESULTS_DEFAULT_CONTEXT.auctionData,
				isAuctionDataLoading,
				isAuctionDataError,
				isAuctionDataSuccess,
			}}
		>
			<BidTableContext.Provider
				value={{
					winningPage,
					setWinningPage,

					minePage,
					setMinePage,

					winningBids: winningBids || BID_TABLE_DEFAULT_CONTEXT.winningBids,
					isWinningBidsLoading,
					isWinningBidsError,
					isWinningBidsSuccess,

					myBids: myBids || BID_TABLE_DEFAULT_CONTEXT.myBids,
					isMyBidsLoading,
					isMyBidsError,
					isMyBidsSuccess,
				}}
			>
				<Stack>
					{ticket}
					<Bids />
				</Stack>
			</BidTableContext.Provider>
		</AuctionResultsContext.Provider>
	);
}
