'use client';

import { useParams } from 'next/navigation';
import { ReactNode, useContext, useState } from 'react';

import { throwError } from '@/helpers';
import { getSingleAuction } from '@/lib/auctions';
import { getPaginatedWinningBids } from '@/lib/bids/open';
import { getPaginatedBids } from '@/lib/bids/open/getPaginatedBids';
import { getMyOpenAuctionResults, getPaginatedOpenAuctionResults } from '@/lib/results/open';
import { CurrentUserContext } from '@/pages/globalContext';
import { NavDirection } from '@/types';
import { Stack } from '@mantine/core';
import { useScrollIntoView } from '@mantine/hooks';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { AuctionResultsContext, DEFAULT_CONTEXT } from './constants';

export interface AuctionResultsProps {
	bids: ReactNode;
	details: ReactNode;
	ticket: ReactNode;
}
export default function AuctionResults({ bids, details, ticket }: AuctionResultsProps) {
	const { auctionId } = useParams();
	const { currentUser } = useContext(CurrentUserContext);

	const [resultsPage, setResultsPage] = useState(DEFAULT_CONTEXT.resultsPage);
	const [allBidsCursor, setAllBidsCursor] = useState<string | null | undefined>(
		DEFAULT_CONTEXT.allBidsCursor,
	);
	const [allBidsNavDirection, setAllBidsNavDirection] = useState<NavDirection>(
		DEFAULT_CONTEXT.allBidsNavDirection,
	);
	const [myBidsCursor, setMyBidsCursor] = useState<string | null | undefined>(
		DEFAULT_CONTEXT.myBidsCursor,
	);
	const [myBidsNavDirection, setMyBidsNavDirection] = useState<NavDirection>(
		DEFAULT_CONTEXT.myBidsNavDirection,
	);
	const [winningBidsPage, setWinningBidsPage] = useState(DEFAULT_CONTEXT.winningBidsPage);

	const [resultsPerPage, setResultsPerPage] = useState(DEFAULT_CONTEXT.resultsPerPage);
	const [bidsPerPage, setBidsPerPage] = useState(DEFAULT_CONTEXT.bidsPerPage);

	const { scrollIntoView: scrollToHistory, targetRef: historyRef } = useScrollIntoView();

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
		data: openAuctionResults,
		isLoading: isOpenAuctionResultsLoading,
		isError: isOpenAuctionResultsError,
		isSuccess: isOpenAuctionResultsSuccess,
	} = useQuery({
		queryKey: [
			'marketplace',
			'@catalogue',
			'openAuctionResults',
			auctionId,
			resultsPage,
			resultsPerPage,
		],
		queryFn: () =>
			throwError(
				getPaginatedOpenAuctionResults({
					auctionId: auctionId as string,
					page: resultsPage,
					perPage: resultsPerPage,
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
		queryKey: [
			'marketplace',
			'@catalogue',
			'allBids',
			auctionId,
			allBidsCursor,
			bidsPerPage,
			//	TODO: either remove or uncomment this once keyset pagination bug is fixed
			allBidsNavDirection,
		],
		queryFn: () =>
			throwError(
				getPaginatedBids({
					auctionId: auctionId as string,
					cursor: allBidsCursor,
					perPage: bidsPerPage,
					navDirection: allBidsNavDirection,
				}),
			),
		placeholderData: keepPreviousData,
	});

	const {
		data: myBids,
		isLoading: isMyBidsLoading,
		isError: isMyBidsError,
		isSuccess: isMyBidsSuccess,
	} = useQuery({
		queryKey: [
			'marketplace',
			'@catalogue',
			'myBids',
			auctionId,
			currentUser.id,
			myBidsCursor,
			bidsPerPage,
			// myBidsNavDirection,
		],
		queryFn: () =>
			throwError(
				getPaginatedBids({
					auctionId: auctionId as string,
					bidderId: currentUser.id,
					cursor: myBidsCursor,
					perPage: bidsPerPage,
					// navDirection: myBidsNavDirection,
				}),
			),
		placeholderData: keepPreviousData,
	});

	const {
		data: winningBids,
		isLoading: isWinningBidsLoading,
		isError: isWinningBidsError,
		isSuccess: isWinningBidsSuccess,
	} = useQuery({
		queryKey: [
			'marketplace',
			'@catalogue',
			'winningBids',
			auctionId,
			winningBidsPage,
			bidsPerPage,
		],
		queryFn: () =>
			throwError(
				getPaginatedWinningBids({
					auctionId: auctionId as string,
					page: winningBidsPage,
					perPage: bidsPerPage,
				}),
			),
		placeholderData: keepPreviousData,
	});

	const {
		data: allWinningBids,
		isLoading: isAllWinningBidsLoading,
		isError: isAllWinningBidsError,
		isSuccess: isAllWinningBidsSuccess,
	} = useQuery({
		queryKey: ['marketplace', '@catalogue', 'allWinningBids', auctionId, 1, 1000000],
		queryFn: () =>
			throwError(
				getPaginatedWinningBids({
					auctionId: auctionId as string,
					page: 1,
					perPage: 1000000,
				}),
			),
		placeholderData: keepPreviousData,
	});

	return (
		<AuctionResultsContext.Provider
			value={{
				scrollToHistory,
				historyRef,

				resultsPage,
				setResultsPage,

				allBidsCursor,
				setAllBidsCursor,
				allBidsNavDirection,
				setAllBidsNavDirection,

				myBidsCursor,
				setMyBidsCursor,
				myBidsNavDirection,
				setMyBidsNavDirection,

				winningBidsPage,
				setWinningBidsPage,

				resultsPerPage,
				setResultsPerPage,

				bidsPerPage,
				setBidsPerPage,

				openAuctionResults: openAuctionResults || DEFAULT_CONTEXT.openAuctionResults,
				isOpenAuctionResultsLoading,
				isOpenAuctionResultsError,
				isOpenAuctionResultsSuccess,

				allBids: allBids || DEFAULT_CONTEXT.allBids,
				isAllBidsLoading,
				isAllBidsError,
				isAllBidsSuccess,

				myBids: myBids || DEFAULT_CONTEXT.myBids,
				isMyBidsLoading,
				isMyBidsError,
				isMyBidsSuccess,

				winningBids: winningBids || DEFAULT_CONTEXT.winningBids,
				isWinningBidsLoading,
				isWinningBidsError,
				isWinningBidsSuccess,

				allWinningBids: allWinningBids || DEFAULT_CONTEXT.allWinningBids,
				isAllWinningBidsLoading,
				isAllWinningBidsError,
				isAllWinningBidsSuccess,

				auctionData: auctionData || DEFAULT_CONTEXT.auctionData,
				isAuctionDataLoading,
				isAuctionDataError,
				isAuctionDataSuccess,

				myOpenAuctionResults: myOpenAuctionResults || DEFAULT_CONTEXT.myOpenAuctionResults,
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
