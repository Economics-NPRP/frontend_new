'use client';

import { useParams } from 'next/navigation';
import { ReactNode, useState } from 'react';

import { getSingleAuction } from '@/lib/auctions';
import { getMyPaginatedBids, getPaginatedWinningBids } from '@/lib/bids/open';
import { Stack } from '@mantine/core';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DEFAULT_CONTEXT as BID_TABLE_DEFAULT_CONTEXT, BidTableContext } from './@bids/constants';
import {
	DEFAULT_CONTEXT as AUCTION_DETAILS_DEFAULT_CONTEXT,
	AuctionDetailsContext,
} from './constants';

export interface AuctionDetailsProps {
	bids: ReactNode;
	details: ReactNode;
	prompt: ReactNode;
}
export default function AuctionPage({ bids, details, prompt }: AuctionDetailsProps) {
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
		<AuctionDetailsContext.Provider
			value={{
				auctionData: auctionData || AUCTION_DETAILS_DEFAULT_CONTEXT.auctionData,
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
					{details}
					{bids}
					{prompt}
				</Stack>
			</BidTableContext.Provider>
		</AuctionDetailsContext.Provider>
	);
}
