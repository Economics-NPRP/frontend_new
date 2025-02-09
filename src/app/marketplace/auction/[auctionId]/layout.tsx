'use client';

import { useParams } from 'next/navigation';
import { ReactNode, useState } from 'react';

import { getSingleAuction } from '@/lib/auctions';
import { getMyPaginatedBids, getPaginatedWinningBids } from '@/lib/bids/open';
import { Stack } from '@mantine/core';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { AuctionDetailsContext, DEFAULT_CONTEXT } from './constants';

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
				winningPage,
				setWinningPage,

				minePage,
				setMinePage,

				auctionData: auctionData || DEFAULT_CONTEXT.auctionData,
				isAuctionDataLoading,
				isAuctionDataError,
				isAuctionDataSuccess,

				winningBids: winningBids || DEFAULT_CONTEXT.winningBids,
				isWinningBidsLoading,
				isWinningBidsError,
				isWinningBidsSuccess,

				myBids: myBids || DEFAULT_CONTEXT.myBids,
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
		</AuctionDetailsContext.Provider>
	);
}
