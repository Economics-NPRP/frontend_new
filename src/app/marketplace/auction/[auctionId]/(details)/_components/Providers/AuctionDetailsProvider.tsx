'use client';

import { useParams } from 'next/navigation';

import { throwError } from '@/helpers';
import { getSingleAuction } from '@/lib/auctions';
import { getMyOpenAuctionResults } from '@/lib/results/open';
import {
	AuctionDetailsContext,
	DEFAULT_AUCTION_DETAILS_CONTEXT,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const AuctionDetailsProvider = ({ children }: { children: React.ReactNode }) => {
	const { auctionId } = useParams();

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

	return (
		<AuctionDetailsContext.Provider
			value={{
				auctionData: auctionData || DEFAULT_AUCTION_DETAILS_CONTEXT.auctionData,
				isAuctionDataLoading,
				isAuctionDataError,
				isAuctionDataSuccess,

				myOpenAuctionResults:
					myOpenAuctionResults || DEFAULT_AUCTION_DETAILS_CONTEXT.myOpenAuctionResults,
				isMyOpenAuctionResultsLoading,
				isMyOpenAuctionResultsError,
				isMyOpenAuctionResultsSuccess,
			}}
		>
			{children}
		</AuctionDetailsContext.Provider>
	);
};
