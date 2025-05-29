'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { throwError } from '@/helpers';
import {
	getMyPaginatedWinningBids,
	getPaginatedBids,
	getPaginatedWinningBids,
} from '@/lib/bids/open';
import {
	AuctionBidsContext,
	DEFAULT_AUCTION_BIDS_CONTEXT,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const AuctionBidsProvider = ({ children }: { children: React.ReactNode }) => {
	const { auctionId } = useParams();

	const [winningPage, setWinningPage] = useState(1);
	const [minePage, setMinePage] = useState(1);

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
		data: myBids,
		isLoading: isMyBidsLoading,
		isError: isMyBidsError,
		isSuccess: isMyBidsSuccess,
	} = useQuery({
		queryKey: ['marketplace', '@catalogue', 'myBids', auctionId, minePage],
		queryFn: () =>
			throwError(
				getMyPaginatedWinningBids({
					auctionId: auctionId as string,
					page: minePage,
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
		queryKey: ['marketplace', '@catalogue', 'allBids', auctionId, minePage, 1],
		queryFn: () =>
			throwError(
				getPaginatedBids({
					auctionId: auctionId as string,
					perPage: 1,
				}),
			),
		placeholderData: keepPreviousData,
	});

	return (
		<AuctionBidsContext.Provider
			value={{
				winningPage,
				setWinningPage,

				minePage,
				setMinePage,

				winningBids: winningBids || DEFAULT_AUCTION_BIDS_CONTEXT.winningBids,
				isWinningBidsLoading,
				isWinningBidsError,
				isWinningBidsSuccess,

				myBids: myBids || DEFAULT_AUCTION_BIDS_CONTEXT.myBids,
				isMyBidsLoading,
				isMyBidsError,
				isMyBidsSuccess,

				allBids: allBids || DEFAULT_AUCTION_BIDS_CONTEXT.allBids,
				isAllBidsLoading,
				isAllBidsError,
				isAllBidsSuccess,
			}}
		>
			{children}
		</AuctionBidsContext.Provider>
	);
};
