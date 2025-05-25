'use client';

import { useParams } from 'next/navigation';
import { ReactNode, useState } from 'react';

import { throwError } from '@/helpers';
import { getSingleAuction } from '@/lib/auctions';
import { getMyPaginatedBids, getPaginatedWinningBids } from '@/lib/bids/open';
import { getMyOpenAuctionResults } from '@/lib/results/open/getMyOpenAuctionResults';
import { Stack } from '@mantine/core';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
	DEFAULT_CONTEXT as AUCTION_RESULTS_DEFAULT_CONTEXT,
	AuctionResultsContext,
} from './constants';

export interface AuctionResultsProps {
	details: ReactNode;
	ticket: ReactNode;
}
export default function AuctionResults({ details, ticket }: AuctionResultsProps) {
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
		queryFn: () => throwError(getSingleAuction(auctionId as string)),
		placeholderData: keepPreviousData,
	});

	const {
		data: myOpenAuctionResults,
		isLoading: isMyOpenAuctionResultsLoading,
		isError: isMyOpenAuctionResultsError,
		isSuccess: isMyOpenAuctionResultsSuccess,
	} = useQuery({
		queryKey: ['marketplace', '@catalogue', 'myOpenAuctionResults', auctionId],
		queryFn: () => throwError(getMyOpenAuctionResults(auctionId as string)),
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
			throwError(
				getPaginatedWinningBids({
					auctionId: auctionId as string,
					page: winningPage,
					perPage: 10,
				}),
			),
		placeholderData: keepPreviousData,
	});

	const {
		data: allBids,
		isLoading: isAllBidsLoading,
		isError: isAllBidsError,
		isSuccess: isAllBidsSuccess,
	} = useQuery({
		queryKey: ['marketplace', '@catalogue', 'allBids', auctionId, winningPage],
		queryFn: () =>
			getPaginatedWinningBids({
				auctionId: auctionId as string,
				page: minePage,
				perPage: 10,
			}),
		placeholderData: keepPreviousData,
	});

	return (
		<AuctionResultsContext.Provider
			value={{
				winningPage,
				setWinningPage,

				minePage,
				setMinePage,

				winningBids: winningBids || AUCTION_RESULTS_DEFAULT_CONTEXT.winningBids,
				isWinningBidsLoading,
				isWinningBidsError,
				isWinningBidsSuccess,

				allBids: allBids || AUCTION_RESULTS_DEFAULT_CONTEXT.allBids,
				isAllBidsLoading,
				isAllBidsError,
				isAllBidsSuccess,

				auctionData: auctionData || AUCTION_RESULTS_DEFAULT_CONTEXT.auctionData,
				isAuctionDataLoading,
				isAuctionDataError,
				isAuctionDataSuccess,

				myOpenAuctionResults:
					myOpenAuctionResults || AUCTION_RESULTS_DEFAULT_CONTEXT.myOpenAuctionResults,
				isMyOpenAuctionResultsLoading,
				isMyOpenAuctionResultsError,
				isMyOpenAuctionResultsSuccess,
			}}
		>
			<Stack>
				{ticket}
				{details}
			</Stack>
		</AuctionResultsContext.Provider>
	);
}
