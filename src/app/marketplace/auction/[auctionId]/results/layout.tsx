'use client';

import { useParams } from 'next/navigation';
import { ReactNode, useState } from 'react';

import { throwError } from '@/helpers';
import { getSingleAuction } from '@/lib/auctions';
import { getPaginatedBids } from '@/lib/bids/open/getPaginatedBids';
import { getMyOpenAuctionResults, getPaginatedOpenAuctionResults } from '@/lib/results/open';
import { NavDirection } from '@/types';
import { Stack } from '@mantine/core';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
	DEFAULT_CONTEXT as AUCTION_RESULTS_DEFAULT_CONTEXT,
	AuctionResultsContext,
} from './constants';

export interface AuctionResultsProps {
	bids: ReactNode;
	details: ReactNode;
	ticket: ReactNode;
}
export default function AuctionResults({ bids, details, ticket }: AuctionResultsProps) {
	const { auctionId } = useParams();

	const [resultsPage, setResultsPage] = useState(1);
	const [allBidsKey, setAllBidsKey] = useState<string | undefined>(undefined);
	const [allBidsNavDirection, setAllBidsNavDirection] = useState<NavDirection>('next');

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
		data: auctionResults,
		isLoading: isAuctionResultsLoading,
		isError: isAuctionResultsError,
		isSuccess: isAuctionResultsSuccess,
	} = useQuery({
		queryKey: ['marketplace', '@catalogue', 'openAuctionResults', auctionId, resultsPage],
		queryFn: () =>
			throwError(
				getPaginatedOpenAuctionResults({
					auctionId: auctionId as string,
					page: resultsPage,
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
		queryKey: ['marketplace', '@catalogue', 'allBids', auctionId, allBidsKey],
		queryFn: () =>
			throwError(
				getPaginatedBids({
					auctionId: auctionId as string,
					bidId: allBidsKey,
					perPage: 10,
					navDirection: allBidsNavDirection,
				}),
			),
		placeholderData: keepPreviousData,
	});

	return (
		<AuctionResultsContext.Provider
			value={{
				resultsPage,
				setResultsPage,

				allBidsKey,
				setAllBidsKey,
				allBidsNavDirection,
				setAllBidsNavDirection,

				auctionResults: auctionResults || AUCTION_RESULTS_DEFAULT_CONTEXT.auctionResults,
				isAuctionResultsLoading,
				isAuctionResultsError,
				isAuctionResultsSuccess,

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
				{bids}
			</Stack>
		</AuctionResultsContext.Provider>
	);
}
