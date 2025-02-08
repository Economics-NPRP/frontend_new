'use client';

import { useParams } from 'next/navigation';
import { ReactNode } from 'react';

import { getSingleAuction } from '@/lib/auctions';
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
	const {
		data: auctionData,
		isLoading: isAuctionDataLoading,
		isError: isAuctionDataError,
		isSuccess: isAuctionDataSuccess,
	} = useQuery({
		queryKey: ['marketplace', '@catalogue', auctionId],
		queryFn: () => getSingleAuction(auctionId as string),
		placeholderData: keepPreviousData,
	});

	return (
		<AuctionDetailsContext.Provider
			value={{
				auctionData: auctionData || DEFAULT_CONTEXT.auctionData,
				isAuctionDataLoading,
				isAuctionDataError,
				isAuctionDataSuccess,
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
