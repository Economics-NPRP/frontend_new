'use client';

import { MyOpenAuctionResultsProvider } from 'contexts/MyOpenAuctionResults';
import { MyPaginatedBidsProvider } from 'contexts/MyPaginatedBids';
import { MyPaginatedWinningBidsProvider } from 'contexts/MyPaginatedWinningBids';
import { PaginatedBidsProvider } from 'contexts/PaginatedBids';
import { PaginatedWinningBidsProvider } from 'contexts/PaginatedWinningBids';
import { SingleAuctionProvider } from 'contexts/SingleAuction';
import { PropsWithChildren, ReactNode } from 'react';

import { withProviders } from '@/helpers';
import { Stack } from '@mantine/core';
import { useScrollIntoView } from '@mantine/hooks';

import { AuctionResultsPageContext } from './constants';

export interface AuctionResultsProps {
	bids: ReactNode;
	details: ReactNode;
	ticket: ReactNode;
}
export default function AuctionResults({ bids, details, ticket }: AuctionResultsProps) {
	return withProviders(
		<>
			<Stack>
				{ticket}
				{details}
				{/* {bids} */}
			</Stack>
		</>,
		{ provider: SingleAuctionProvider },
		{ provider: MyOpenAuctionResultsProvider },
		{ provider: MyPaginatedWinningBidsProvider },
		{ provider: PaginatedWinningBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: PaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: MyPaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: PageProvider },
	);
}

const PageProvider = ({ children }: PropsWithChildren) => {
	const { scrollIntoView: scrollToHistory, targetRef: historyRef } = useScrollIntoView();
	return (
		<AuctionResultsPageContext.Provider
			value={{
				scrollToHistory,
				historyRef,
			}}
		>
			{children}
		</AuctionResultsPageContext.Provider>
	);
};
