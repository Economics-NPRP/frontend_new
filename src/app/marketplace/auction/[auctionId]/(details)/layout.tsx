'use client';

import { useParams } from 'next/navigation';
import { ReactNode, useState } from 'react';

import { throwError } from '@/helpers';
import { getSingleAuction } from '@/lib/auctions';
import {
	getMyPaginatedWinningBids,
	getPaginatedBids,
	getPaginatedWinningBids,
} from '@/lib/bids/open';
import { getMyOpenAuctionResults } from '@/lib/results/open';
import { Button, Container, Stack } from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DEFAULT_CONTEXT as BID_TABLE_DEFAULT_CONTEXT, BidTableContext } from './@bids/constants';
import {
	DEFAULT_CONTEXT as AUCTION_DETAILS_DEFAULT_CONTEXT,
	AuctionDetailsContext,
} from './constants';
import classes from './styles.module.css';

export interface AuctionDetailsProps {
	bids: ReactNode;
	details: ReactNode;
	ended: ReactNode;
	permits: ReactNode;
	prompt: ReactNode;
	suggestions: ReactNode;
}
export default function AuctionPage({
	bids,
	details,
	ended,
	permits,
	prompt,
	suggestions,
}: AuctionDetailsProps) {
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
				auctionData: auctionData || AUCTION_DETAILS_DEFAULT_CONTEXT.auctionData,
				isAuctionDataLoading,
				isAuctionDataError,
				isAuctionDataSuccess,

				myOpenAuctionResults:
					myOpenAuctionResults || AUCTION_DETAILS_DEFAULT_CONTEXT.myOpenAuctionResults,
				isMyOpenAuctionResultsLoading,
				isMyOpenAuctionResultsError,
				isMyOpenAuctionResultsSuccess,
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

					allBids: allBids || BID_TABLE_DEFAULT_CONTEXT.allBids,
					isAllBidsLoading,
					isAllBidsError,
					isAllBidsSuccess,
				}}
			>
				<Container className={classes.bg}>
					<Container className={`${classes.graphic} bg-grid-md`} />
					<Container className={classes.gradient} />
				</Container>
				<Stack className={classes.root}>
					<Button
						component="a"
						// TODO: change to explore page when available
						href="/marketplace"
						className={classes.button}
						leftSection={<IconArrowUpLeft />}
					>
						Return to Catalogue
					</Button>
					{details}
					{bids}
					{prompt}
					{suggestions}
				</Stack>
				{ended}
			</BidTableContext.Provider>
		</AuctionDetailsContext.Provider>
	);
}
